import { prismaClient } from "../src/lib/prisma";

type RecipeSeed = {
  title: string;
  slug: string;
  description: string;
  image: string;
  prepTime: number;
  cookingTime: number;
  servings: number;
  countryCode: string;
  ingredients: {
    name: string;
    quantity?: number;
    quantityText?: string;
    unit?: string;
    preparation?: string;
  }[];
  steps: {
    title: string;
    instruction: string;
  }[];
  categories: string[];
};

const categoryData = [
  { name: "Lunch", type: "MEAL" },
  { name: "Dinner", type: "MEAL" },
  { name: "Stir-Fry", type: "COOKING_METHOD" },
  { name: "Pan-Fried", type: "COOKING_METHOD" },
  { name: "Simmered", type: "COOKING_METHOD" },
] as const;

const recipes: RecipeSeed[] = [
  {
    title: "Garlic Butter Pasta",
    slug: "garlic-butter-pasta",
    description: "Simple pasta tossed with garlic butter and Parmesan.",
    image: "recipes/garlic-butter-pasta.webp",
    prepTime: 5,
    cookingTime: 15,
    servings: 2,
    countryCode: "IT",
    ingredients: [
      { name: "Spaghetti", quantity: 200, unit: "g" },
      { name: "Butter", quantity: 30, unit: "g" },
      {
        name: "Garlic",
        quantity: 4,
        unit: "cloves",
        preparation: "thinly sliced",
      },
      {
        name: "Parmesan",
        quantity: 30,
        unit: "g",
        preparation: "grated",
      },
      {
        name: "Parsley",
        quantity: 1,
        unit: "tbsp",
        preparation: "chopped",
      },
      { name: "Salt", quantityText: "To taste" },
      { name: "Black Pepper", quantityText: "To taste" },
    ],
    steps: [
      {
        title: "Cook the pasta",
        instruction:
          "Bring a pot of salted water to a boil. Cook the spaghetti according to the package instructions. Reserve some pasta water before draining.",
      },
      {
        title: "Prepare the garlic butter",
        instruction:
          "Melt the butter in a pan over medium-low heat. Add the garlic and cook until fragrant and lightly golden.",
      },
      {
        title: "Toss the pasta",
        instruction:
          "Add the drained spaghetti to the pan. Toss with the garlic butter, adding a little reserved pasta water to loosen the sauce.",
      },
      {
        title: "Finish and serve",
        instruction:
          "Remove from the heat. Stir in the Parmesan and parsley, then season with salt and black pepper.",
      },
    ],
    categories: ["Lunch", "Dinner"],
  },
  {
    title: "Thai Basil Chicken",
    slug: "thai-basil-chicken",
    description: "Stir-fried chicken with basil, garlic, and chili.",
    image: "recipes/thai-basil-chicken.webp",
    prepTime: 10,
    cookingTime: 15,
    servings: 2,
    countryCode: "TH",
    ingredients: [
      {
        name: "Chicken",
        quantity: 300,
        unit: "g",
        preparation: "finely chopped",
      },
      {
        name: "Holy Basil",
        quantity: 20,
        unit: "g",
        preparation: "leaves picked",
      },
      {
        name: "Garlic",
        quantity: 4,
        unit: "cloves",
        preparation: "minced",
      },
      {
        name: "Red Chili",
        quantity: 2,
        unit: "pieces",
        preparation: "sliced",
      },
      { name: "Vegetable Oil", quantity: 1, unit: "tbsp" },
      { name: "Soy Sauce", quantity: 1, unit: "tbsp" },
      { name: "Oyster Sauce", quantity: 1, unit: "tbsp" },
      { name: "Sugar", quantity: 0.5, unit: "tsp" },
      { name: "Cooked Rice", quantity: 300, unit: "g" },
    ],
    steps: [
      {
        title: "Prepare the ingredients",
        instruction:
          "Chop the chicken, mince the garlic, slice the chili, and wash the basil leaves.",
      },
      {
        title: "Cook the aromatics",
        instruction:
          "Heat the oil in a wok or large pan. Stir-fry the garlic and chili briefly until fragrant.",
      },
      {
        title: "Stir-fry the chicken",
        instruction:
          "Add the chicken and stir-fry until cooked through. Add the soy sauce, oyster sauce, and sugar. Stir well.",
      },
      {
        title: "Add basil and serve",
        instruction:
          "Stir in the basil until just wilted. Serve immediately with cooked rice.",
      },
    ],
    categories: ["Lunch", "Dinner", "Stir-Fry"],
  },
  {
    title: "Chicken Teriyaki",
    slug: "chicken-teriyaki",
    description: "Pan-fried chicken coated in a sweet and savory glaze.",
    image: "recipes/chicken-teriyaki.webp",
    prepTime: 10,
    cookingTime: 20,
    servings: 2,
    countryCode: "JP",
    ingredients: [
      {
        name: "Chicken",
        quantity: 350,
        unit: "g",
        preparation: "boneless thighs",
      },
      { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
      { name: "Mirin", quantity: 2, unit: "tbsp" },
      { name: "Sake", quantity: 1, unit: "tbsp" },
      { name: "Sugar", quantity: 1, unit: "tbsp" },
      { name: "Vegetable Oil", quantity: 1, unit: "tsp" },
      { name: "Sesame Seeds", quantity: 1, unit: "tsp" },
      {
        name: "Spring Onion",
        quantity: 1,
        unit: "piece",
        preparation: "sliced",
      },
      { name: "Cooked Rice", quantity: 300, unit: "g" },
    ],
    steps: [
      {
        title: "Mix the sauce",
        instruction:
          "Combine the soy sauce, mirin, sake, and sugar in a small bowl.",
      },
      {
        title: "Pan-fry the chicken",
        instruction:
          "Heat the oil in a pan over medium heat. Cook the chicken on both sides until browned and cooked through.",
      },
      {
        title: "Glaze the chicken",
        instruction:
          "Add the sauce and simmer, turning the chicken to coat it, until the sauce thickens into a glossy glaze.",
      },
      {
        title: "Slice and serve",
        instruction:
          "Slice the chicken and serve with rice. Spoon over the sauce and garnish with sesame seeds and spring onion.",
      },
    ],
    categories: ["Lunch", "Dinner", "Pan-Fried"],
  },
  {
    title: "Burmese Chicken Curry",
    slug: "burmese-chicken-curry",
    description: "Chicken simmered with onions, garlic, ginger, and spices.",
    image: "recipes/burmese-chicken-curry.webp",
    prepTime: 15,
    cookingTime: 40,
    servings: 4,
    countryCode: "MM",
    ingredients: [
      {
        name: "Chicken",
        quantity: 800,
        unit: "g",
        preparation: "bone-in pieces",
      },
      {
        name: "Onion",
        quantity: 2,
        unit: "pieces",
        preparation: "finely chopped",
      },
      {
        name: "Garlic",
        quantity: 5,
        unit: "cloves",
        preparation: "minced",
      },
      {
        name: "Ginger",
        quantity: 20,
        unit: "g",
        preparation: "minced",
      },
      {
        name: "Tomato",
        quantity: 2,
        unit: "pieces",
        preparation: "chopped",
      },
      { name: "Vegetable Oil", quantity: 3, unit: "tbsp" },
      { name: "Turmeric", quantity: 0.5, unit: "tsp" },
      { name: "Chili Powder", quantity: 1, unit: "tsp" },
      { name: "Fish Sauce", quantity: 1, unit: "tbsp" },
      { name: "Water", quantity: 250, unit: "ml" },
      { name: "Salt", quantityText: "To taste" },
    ],
    steps: [
      {
        title: "Season the chicken",
        instruction:
          "Coat the chicken with turmeric, fish sauce, and a little salt. Set aside while preparing the remaining ingredients.",
      },
      {
        title: "Cook the curry base",
        instruction:
          "Heat the oil in a pot. Cook the onions until softened and golden. Add the garlic and ginger, then stir until fragrant.",
      },
      {
        title: "Add tomatoes and spices",
        instruction:
          "Add the tomatoes and chili powder. Cook until the tomatoes soften and the mixture becomes a thick curry base.",
      },
      {
        title: "Simmer the chicken",
        instruction:
          "Add the chicken and coat it with the curry base. Add the water, cover, and simmer gently until the chicken is tender and cooked through.",
      },
      {
        title: "Finish the curry",
        instruction:
          "Remove the lid and reduce the sauce until some oil separates around the edges. Adjust the seasoning and serve with rice.",
      },
    ],
    categories: ["Dinner", "Simmered"],
  },
];

async function main() {
  // 1. Continents
  const asia = await prismaClient.continent.upsert({
    where: { name: "Asia" },
    update: {},
    create: { name: "Asia" },
  });

  const europe = await prismaClient.continent.upsert({
    where: { name: "Europe" },
    update: {},
    create: { name: "Europe" },
  });

  // 2. Countries
  const countryData = [
    {
      name: "Italy",
      code: "IT",
      cuisineName: "Italian",
      continentId: europe.id,
    },
    {
      name: "Thailand",
      code: "TH",
      cuisineName: "Thai",
      continentId: asia.id,
    },
    {
      name: "Japan",
      code: "JP",
      cuisineName: "Japanese",
      continentId: asia.id,
    },
    {
      name: "Myanmar",
      code: "MM",
      cuisineName: "Burmese",
      continentId: asia.id,
    },
  ];

  const countries = new Map<string, number>();

  for (const country of countryData) {
    const savedCountry = await prismaClient.country.upsert({
      where: { code: country.code },
      update: {
        name: country.name,
        cuisineName: country.cuisineName,
        continentId: country.continentId,
      },
      create: country,
    });

    countries.set(country.code, savedCountry.id);
  }

  // 3. Categories
  const categories = new Map<string, number>();

  for (const category of categoryData) {
    const savedCategory = await prismaClient.category.upsert({
      where: { name: category.name },
      update: {
        type: category.type,
      },
      create: {
        name: category.name,
        type: category.type,
      },
    });

    categories.set(category.name, savedCategory.id);
  }

  // 4. Shared ingredients
  // Seed these before the recipe transactions to keep transactions short.
  const ingredientNames = new Set(
    recipes.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.name),
    ),
  );

  const ingredients = new Map<string, number>();

  for (const name of ingredientNames) {
    const savedIngredient = await prismaClient.ingredient.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    ingredients.set(name, savedIngredient.id);
  }

  // 5. Recipes and their related records
  for (const item of recipes) {
    const {
      countryCode,
      ingredients: recipeIngredients,
      steps,
      categories: recipeCategories,
      ...recipe
    } = item;

    const countryId = countries.get(countryCode);

    if (countryId === undefined) {
      throw new Error(`Country not found: ${countryCode}`);
    }

    // Validate and prepare relation data before writing.
    const ingredientData = recipeIngredients.map((ingredient, index) => {
      const ingredientId = ingredients.get(ingredient.name);

      if (ingredientId === undefined) {
        throw new Error(`Ingredient not found: ${ingredient.name}`);
      }

      return {
        ingredientId,
        quantity: ingredient.quantity ?? null,
        quantityText: ingredient.quantityText ?? null,
        unit: ingredient.unit ?? null,
        preparation: ingredient.preparation ?? null,
        position: index + 1,
      };
    });

    const categoryIds = recipeCategories.map((name) => {
      const categoryId = categories.get(name);

      if (categoryId === undefined) {
        throw new Error(`Category not found: ${name}`);
      }

      return categoryId;
    });

    await prismaClient.$transaction(async (tx) => {
      const savedRecipe = await tx.recipe.upsert({
        where: { slug: recipe.slug },
        update: {
          ...recipe,
          countryId,
        },
        create: {
          ...recipe,
          countryId,
        },
      });

      // Replace seeded details when this script runs again.
      // The recipe itself keeps its ID, reviews, and saved records.
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: savedRecipe.id },
      });

      await tx.recipeStep.deleteMany({
        where: { recipeId: savedRecipe.id },
      });

      await tx.recipeCategory.deleteMany({
        where: { recipeId: savedRecipe.id },
      });

      await tx.recipeIngredient.createMany({
        data: ingredientData.map((ingredient) => ({
          recipeId: savedRecipe.id,
          ...ingredient,
        })),
      });

      await tx.recipeStep.createMany({
        data: steps.map((step, index) => ({
          recipeId: savedRecipe.id,
          stepNumber: index + 1,
          title: step.title,
          instruction: step.instruction,
        })),
      });

      await tx.recipeCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          recipeId: savedRecipe.id,
          categoryId,
        })),
      });
    });

    console.log(`Seeded recipe: ${recipe.title}`);
  }

  console.log(
    "Seed complete: continents, countries, recipes, ingredients, steps, and categories.",
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });