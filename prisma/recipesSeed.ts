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
  // Meal
  { name: "Breakfast", type: "MEAL" },
  { name: "Lunch", type: "MEAL" },
  { name: "Dinner", type: "MEAL" },
  { name: "Snacks", type: "MEAL" },
  { name: "Dessert", type: "MEAL" },

  // Diet
  { name: "Vegetarian", type: "DIET" },
  { name: "Vegan", type: "DIET" },
  { name: "Gluten Free", type: "DIET" },
  { name: "Dairy Free", type: "DIET" },
  { name: "Low Carb", type: "DIET" },
  { name: "High Protein", type: "DIET" },
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
    categories: ["Lunch", "Dinner", "Dairy Free"],
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
    categories: ["Lunch", "Dinner", "Dairy Free"],
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
    categories: ["Dinner", "Dairy Free"],
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

  const northAmerica = await prismaClient.continent.upsert({
    where: { name: "North America" },
    update: {},
    create: { name: "North America" },
  });

  const southAmerica = await prismaClient.continent.upsert({
    where: { name: "South America" },
    update: {},
    create: { name: "South America" },
  });

  const africa = await prismaClient.continent.upsert({
    where: { name: "Africa" },
    update: {},
    create: { name: "Africa" },
  });

  const oceania = await prismaClient.continent.upsert({
    where: { name: "Oceania" },
    update: {},
    create: { name: "Oceania" },
  });

  // 2. Countries
  const countryData = [
    // Asia
    { name: "Thailand", code: "TH", cuisineName: "Thai", continentId: asia.id },
    { name: "Japan", code: "JP", cuisineName: "Japanese", continentId: asia.id },
    { name: "Myanmar", code: "MM", cuisineName: "Burmese", continentId: asia.id },
    { name: "India", code: "IN", cuisineName: "Indian", continentId: asia.id },
    { name: "China", code: "CN", cuisineName: "Chinese", continentId: asia.id },
    { name: "South Korea", code: "KR", cuisineName: "Korean", continentId: asia.id },
    { name: "Vietnam", code: "VN", cuisineName: "Vietnamese", continentId: asia.id },
    { name: "Indonesia", code: "ID", cuisineName: "Indonesian", continentId: asia.id },
    { name: "Malaysia", code: "MY", cuisineName: "Malaysian", continentId: asia.id },
    { name: "Singapore", code: "SG", cuisineName: "Singaporean", continentId: asia.id },
    { name: "Philippines", code: "PH", cuisineName: "Filipino", continentId: asia.id },
    { name: "Pakistan", code: "PK", cuisineName: "Pakistani", continentId: asia.id },
    { name: "Bangladesh", code: "BD", cuisineName: "Bangladeshi", continentId: asia.id },
    { name: "Sri Lanka", code: "LK", cuisineName: "Sri Lankan", continentId: asia.id },
    { name: "Nepal", code: "NP", cuisineName: "Nepalese", continentId: asia.id },
    { name: "Lebanon", code: "LB", cuisineName: "Lebanese", continentId: asia.id },
    { name: "Iran", code: "IR", cuisineName: "Iranian", continentId: asia.id },

    // Europe
    { name: "Italy", code: "IT", cuisineName: "Italian", continentId: europe.id },
    { name: "France", code: "FR", cuisineName: "French", continentId: europe.id },
    { name: "Spain", code: "ES", cuisineName: "Spanish", continentId: europe.id },
    { name: "Greece", code: "GR", cuisineName: "Greek", continentId: europe.id },
    { name: "Portugal", code: "PT", cuisineName: "Portuguese", continentId: europe.id },
    { name: "Germany", code: "DE", cuisineName: "German", continentId: europe.id },
    { name: "United Kingdom", code: "GB", cuisineName: "British", continentId: europe.id },
    { name: "Ireland", code: "IE", cuisineName: "Irish", continentId: europe.id },
    { name: "Poland", code: "PL", cuisineName: "Polish", continentId: europe.id },
    { name: "Sweden", code: "SE", cuisineName: "Swedish", continentId: europe.id },

    // North America
    { name: "United States", code: "US", cuisineName: "American", continentId: northAmerica.id },
    { name: "Mexico", code: "MX", cuisineName: "Mexican", continentId: northAmerica.id },
    { name: "Canada", code: "CA", cuisineName: "Canadian", continentId: northAmerica.id },
    { name: "Jamaica", code: "JM", cuisineName: "Jamaican", continentId: northAmerica.id },
    { name: "Cuba", code: "CU", cuisineName: "Cuban", continentId: northAmerica.id },

    // South America
    { name: "Brazil", code: "BR", cuisineName: "Brazilian", continentId: southAmerica.id },
    { name: "Argentina", code: "AR", cuisineName: "Argentinian", continentId: southAmerica.id },
    { name: "Peru", code: "PE", cuisineName: "Peruvian", continentId: southAmerica.id },
    { name: "Colombia", code: "CO", cuisineName: "Colombian", continentId: southAmerica.id },

    // Africa
    { name: "Morocco", code: "MA", cuisineName: "Moroccan", continentId: africa.id },
    { name: "Egypt", code: "EG", cuisineName: "Egyptian", continentId: africa.id },
    { name: "Ethiopia", code: "ET", cuisineName: "Ethiopian", continentId: africa.id },
    { name: "Nigeria", code: "NG", cuisineName: "Nigerian", continentId: africa.id },
    { name: "South Africa", code: "ZA", cuisineName: "South African", continentId: africa.id },

    // Oceania
    { name: "Australia", code: "AU", cuisineName: "Australian", continentId: oceania.id },
    { name: "New Zealand", code: "NZ", cuisineName: "New Zealand", continentId: oceania.id },
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
      recipe.ingredients.map((ingredient) => ingredient.name)
    )
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
    "Seed complete: continents, countries, recipes, ingredients, steps, and categories."
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
