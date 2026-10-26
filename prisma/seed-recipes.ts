import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../generated/prisma/client";

type SeedCategory = { name: string; type: "MEAL" | "DIET" };
type SeedIngredient = {
  name: string;
  quantity: number | null;
  quantityText: string;
  unit: string | null;
  preparation: string | null;
  position: number;
};
type SeedRecipe = {
  title: string; slug: string; countryCode: string; description: string;
  image: string; prepTime: number; cookingTime: number; servings: number;
  categories: SeedCategory[]; ingredients: SeedIngredient[];
  steps: { stepNumber: number; title: string; instruction: string; image: string | null }[];
};

const recipes = JSON.parse(
  readFileSync(new URL("./recipes.json", import.meta.url), "utf8"),
) as SeedRecipe[];
const args = new Set(process.argv.slice(2));
for (const arg of args) {
  if (!["--dry-run", "--update-existing"].includes(arg)) {
    throw new Error(`Unknown option: ${arg}`);
  }
}
const dryRun = args.has("--dry-run");
const updateExisting = args.has("--update-existing");

function validateData() {
  if (!Array.isArray(recipes) || recipes.length !== 100) throw new Error("Expected exactly 100 recipes.");
  const slugs = new Set<string>();
  const countryCounts = new Map<string, number>();
  const categories = new Map<string, SeedCategory>();
  for (const r of recipes) {
    if (!r.title || r.title.length > 255 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.slug)) {
      throw new Error(`Invalid title/slug: ${r.title}`);
    }
    if (slugs.has(r.slug)) throw new Error(`Duplicate slug: ${r.slug}`);
    slugs.add(r.slug);
    if (!/^[A-Z]{2}$/.test(r.countryCode)) throw new Error(`Invalid country: ${r.slug}`);
    countryCounts.set(r.countryCode, (countryCounts.get(r.countryCode) ?? 0) + 1);
    if (r.image !== `recipes/${r.slug}.webp`) throw new Error(`Image mismatch: ${r.slug}`);
    for (const n of [r.prepTime, r.cookingTime, r.servings]) {
      if (!Number.isInteger(n) || n < 0 || n > 32767) throw new Error(`Invalid numeric value: ${r.slug}`);
    }
    if (r.servings < 1 || !r.description || r.ingredients.length < 3 || r.steps.length < 3) {
      throw new Error(`Incomplete recipe: ${r.slug}`);
    }
    const names = new Set<string>();
    r.ingredients.forEach((i, index) => {
      if (!i.name || i.name.length > 100 || names.has(i.name) || i.position !== index + 1 ||
          !i.quantityText || i.quantityText.length > 100 || (i.unit?.length ?? 0) > 50 ||
          (i.preparation?.length ?? 0) > 100) throw new Error(`Invalid ingredient: ${r.slug}`);
      names.add(i.name);
    });
    r.steps.forEach((s, index) => {
      if (s.stepNumber !== index + 1 || !s.instruction || s.title.length > 150) {
        throw new Error(`Invalid step: ${r.slug}`);
      }
    });
    const recipeCategories = new Set<string>();
    for (const c of r.categories) {
      if (!["MEAL", "DIET"].includes(c.type) || !c.name || c.name.length > 100 || recipeCategories.has(c.name)) {
        throw new Error(`Invalid category: ${r.slug}`);
      }
      recipeCategories.add(c.name);
      const previous = categories.get(c.name);
      if (previous && previous.type !== c.type) throw new Error(`Conflicting category: ${c.name}`);
      categories.set(c.name, c);
    }
  }
  if (countryCounts.size !== 50 || [...countryCounts.values()].some(n => n !== 2)) {
    throw new Error("Expected two recipes per country across 50 countries.");
  }
  return categories;
}

async function seed(prisma: PrismaClient) {
  const categories = validateData();
  // All read-only preflight checks happen before the first write.
  const requiredCodes = [...new Set(recipes.map(r => r.countryCode))];
  const countries = await prisma.country.findMany({
    where: { code: { in: requiredCodes } }, select: { id: true, code: true },
  });
  const countryIds = new Map(countries.map(c => [c.code, c.id]));
  const missing = requiredCodes.filter(code => !countryIds.has(code));
  if (missing.length) throw new Error(`Missing Country rows: ${missing.join(", ")}. Import your countries first.`);
  const existingCategories = await prisma.category.findMany({ where: { name: { in: [...categories.keys()] } } });
  for (const c of existingCategories) {
    if (c.type !== categories.get(c.name)!.type) {
      throw new Error(`Category '${c.name}' already has type ${c.type}; expected ${categories.get(c.name)!.type}. Resolve before seeding.`);
    }
  }
  const existing = await prisma.recipe.findMany({
    where: { slug: { in: recipes.map(r => r.slug) } }, select: { slug: true },
  });
  console.log(`Preflight passed: 100 recipes, 50 countries, ${existing.length} existing slugs.`);
  console.log(`Plan: create ${100 - existing.length}; ${updateExisting ? "update" : "skip"} ${existing.length}.`);
  if (dryRun) { console.log("Dry run completed. No database writes."); return; }

  let created = 0, updated = 0, skipped = 0;
  for (const r of recipes) {
    // One transaction per recipe: partial runs can be safely resumed.
    const outcome = await prisma.$transaction(async tx => {
      const current = await tx.recipe.findUnique({ where: { slug: r.slug }, select: { id: true } });
      if (current && !updateExisting) return "skipped" as const;
      const ingredientRows: { ingredientId: number; quantity: Prisma.Decimal | null;
        quantityText: string; unit: string | null; preparation: string | null; position: number }[] = [];
      for (const i of r.ingredients) {
        const ingredient = await tx.ingredient.upsert({
          where: { name: i.name }, update: {}, create: { name: i.name },
        });
        ingredientRows.push({
          ingredientId: ingredient.id,
          quantity: i.quantity === null ? null : new Prisma.Decimal(i.quantity),
          quantityText: i.quantityText, unit: i.unit, preparation: i.preparation, position: i.position,
        });
      }
      const categoryRows: { categoryId: number }[] = [];
      for (const c of r.categories) {
        const category = await tx.category.upsert({ where: { name: c.name }, update: {}, create: c });
        if (category.type !== c.type) throw new Error(`Category type changed during seed: ${c.name}`);
        categoryRows.push({ categoryId: category.id });
      }
      const data = {
        title: r.title, slug: r.slug, description: r.description, image: r.image,
        prepTime: r.prepTime, cookingTime: r.cookingTime, servings: r.servings,
        countryId: countryIds.get(r.countryCode)!,
      };
      if (current) {
        // Only the selected recipe's editable content is replaced. Keep its ID,
        // reviews, bookmarks, and creation timestamp.
        await tx.recipeIngredient.deleteMany({ where: { recipeId: current.id } });
        await tx.recipeStep.deleteMany({ where: { recipeId: current.id } });
        await tx.recipeCategory.deleteMany({ where: { recipeId: current.id } });
        await tx.recipe.update({ where: { id: current.id }, data: {
          ...data, recipeIngredients: { create: ingredientRows },
          recipeSteps: { create: r.steps }, recipeCategories: { create: categoryRows },
        } });
        return "updated" as const;
      }
      await tx.recipe.create({ data: {
        ...data, recipeIngredients: { create: ingredientRows },
        recipeSteps: { create: r.steps }, recipeCategories: { create: categoryRows },
      } });
      return "created" as const;
    }, { maxWait: 10000, timeout: 60000 });
    if (outcome === "created") created++;
    else if (outcome === "updated") updated++;
    else skipped++;
    console.log(`[${created + updated + skipped}/100] ${outcome}: ${r.slug}`);
  }
  const count = await prisma.recipe.count({ where: { slug: { in: recipes.map(r => r.slug) } } });
  if (count !== 100) throw new Error(`Verification failed: ${count}/100 slugs found.`);
  console.log(`Done. Created ${created}, updated ${updated}, skipped ${skipped}. All 100 slugs exist.`);
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing from your backend environment.");
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  try { await seed(prisma); } finally { await prisma.$disconnect(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
