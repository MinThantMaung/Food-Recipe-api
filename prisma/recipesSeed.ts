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
  { name: "Breakfast", type: "MEAL", image: "categories/breakfast.webp" },
  { name: "Lunch", type: "MEAL", image: "categories/lunch.webp" },
  { name: "Dinner", type: "MEAL", image: "categories/dinner.webp" },
  { name: "Snacks", type: "MEAL", image: "categories/snacks.webp" },
  { name: "Dessert", type: "MEAL", image: "categories/dessert.webp" },

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
    {
      name: "Thailand",
      code: "TH",
      cuisineName: "Thai",
      image: "cuisines/thai.webp",
      description:
        "Discover vibrant dishes that balance sweet, sour, salty, and spicy flavors with fresh herbs and aromatic ingredients.",
      continentId: asia.id,
    },
    {
      name: "Japan",
      code: "JP",
      cuisineName: "Japanese",
      image: "cuisines/japanese.webp",
      description:
        "Explore comforting and carefully prepared dishes that celebrate seasonal ingredients, delicate flavors, and rich umami.",
      continentId: asia.id,
    },
    {
      name: "Myanmar",
      code: "MM",
      cuisineName: "Burmese",
      image: "cuisines/burmese.webp",
      description:
        "Enjoy comforting curries, flavorful noodle dishes, and refreshing salads made with fragrant spices and bold ingredients.",
      continentId: asia.id,
    },
    {
      name: "India",
      code: "IN",
      cuisineName: "Indian",
      image: "cuisines/indian.webp",
      description:
        "Discover diverse regional dishes featuring aromatic spices, rich curries, hearty lentils, and freshly prepared breads.",
      continentId: asia.id,
    },
    {
      name: "China",
      code: "CN",
      cuisineName: "Chinese",
      image: "cuisines/chinese.webp",
      description:
        "Explore a wide variety of regional flavors, from savory stir-fries and handmade dumplings to warming soups and noodles.",
      continentId: asia.id,
    },
    {
      name: "South Korea",
      code: "KR",
      cuisineName: "Korean",
      image: "cuisines/korean.webp",
      description:
        "Enjoy bold, savory dishes featuring fermented ingredients, spicy sauces, grilled meats, and colorful vegetable sides.",
      continentId: asia.id,
    },
    {
      name: "Vietnam",
      code: "VN",
      cuisineName: "Vietnamese",
      image: "cuisines/vietnamese.webp",
      description:
        "Discover fresh and fragrant dishes combining herbs, rice noodles, crisp vegetables, and flavorful broths.",
      continentId: asia.id,
    },
    {
      name: "Indonesia",
      code: "ID",
      cuisineName: "Indonesian",
      image: "cuisines/indonesian.webp",
      description:
        "Explore rich island flavors with aromatic spice pastes, coconut milk, savory rice dishes, and grilled specialties.",
      continentId: asia.id,
    },
    {
      name: "Malaysia",
      code: "MY",
      cuisineName: "Malaysian",
      image: "cuisines/malaysian.webp",
      description:
        "Enjoy a diverse blend of Malay, Chinese, and Indian influences through fragrant rice dishes, spicy noodles, and comforting curries.",
      continentId: asia.id,
    },
    {
      name: "Singapore",
      code: "SG",
      cuisineName: "Singaporean",
      image: "cuisines/singaporean.webp",
      description:
        "Discover beloved hawker favorites that bring together Chinese, Malay, Indian, and Peranakan flavors.",
      continentId: asia.id,
    },
    {
      name: "Philippines",
      code: "PH",
      cuisineName: "Filipino",
      image: "cuisines/filipino.webp",
      description:
        "Enjoy hearty dishes with savory, tangy, and sweet flavors, from slow-cooked stews to grilled favorites.",
      continentId: asia.id,
    },
    {
      name: "Pakistan",
      code: "PK",
      cuisineName: "Pakistani",
      image: "cuisines/pakistani.webp",
      description:
        "Discover richly spiced curries, fragrant rice dishes, grilled meats, and comforting breads made for sharing.",
      continentId: asia.id,
    },
    {
      name: "Bangladesh",
      code: "BD",
      cuisineName: "Bangladeshi",
      image: "cuisines/bangladeshi.webp",
      description:
        "Explore flavorful fish curries, comforting rice dishes, and hearty lentils seasoned with mustard and aromatic spices.",
      continentId: asia.id,
    },
    {
      name: "Sri Lanka",
      code: "LK",
      cuisineName: "Sri Lankan",
      image: "cuisines/sri-lankan.webp",
      description:
        "Enjoy vibrant curries, coconut-rich dishes, and distinctive rice and bread specialties seasoned with fragrant spices.",
      continentId: asia.id,
    },
    {
      name: "Nepal",
      code: "NP",
      cuisineName: "Nepalese",
      image: "cuisines/nepalese.webp",
      description:
        "Discover comforting lentil dishes, steamed dumplings, and warming curries inspired by diverse Himalayan traditions.",
      continentId: asia.id,
    },
    {
      name: "Lebanon",
      code: "LB",
      cuisineName: "Lebanese",
      image: "cuisines/lebanese.webp",
      description:
        "Explore fresh mezze, grilled specialties, and hearty dishes featuring herbs, lemon, olive oil, and warm spices.",
      continentId: asia.id,
    },
    {
      name: "Iran",
      code: "IR",
      cuisineName: "Iranian",
      image: "cuisines/iranian.webp",
      description:
        "Enjoy fragrant rice dishes, slow-cooked stews, and grilled specialties enriched with saffron, herbs, and dried fruits.",
      continentId: asia.id,
    },
    // Europe
    {
      name: "Italy",
      code: "IT",
      cuisineName: "Italian",
      image: "cuisines/italian.webp",
      description:
        "Discover comforting pasta, rustic pizzas, and regional favorites that celebrate fresh ingredients and simple preparation.",
      continentId: europe.id,
    },
    {
      name: "France",
      code: "FR",
      cuisineName: "French",
      image: "cuisines/french.webp",
      description:
        "Explore classic dishes, rustic stews, and delicate pastries shaped by regional ingredients and time-honored cooking techniques.",
      continentId: europe.id,
    },
    {
      name: "Spain",
      code: "ES",
      cuisineName: "Spanish",
      image: "cuisines/spanish.webp",
      description:
        "Enjoy colorful tapas, savory rice dishes, and regional specialties featuring olive oil, fresh seafood, and smoky paprika.",
      continentId: europe.id,
    },
    {
      name: "Greece",
      code: "GR",
      cuisineName: "Greek",
      image: "cuisines/greek.webp",
      description:
        "Discover sunny Mediterranean flavors with fresh vegetables, olive oil, fragrant herbs, and delicious grilled dishes.",
      continentId: europe.id,
    },
    {
      name: "Portugal",
      code: "PT",
      cuisineName: "Portuguese",
      image: "cuisines/portuguese.webp",
      description:
        "Explore comforting seafood dishes, rustic soups, and golden pastries rooted in coastal and regional traditions.",
      continentId: europe.id,
    },
    {
      name: "Germany",
      code: "DE",
      cuisineName: "German",
      image: "cuisines/german.webp",
      description:
        "Enjoy hearty regional dishes featuring savory meats, potatoes, dumplings, and traditional breads.",
      continentId: europe.id,
    },
    {
      name: "United Kingdom",
      code: "GB",
      cuisineName: "British",
      image: "cuisines/british.webp",
      description:
        "Discover comforting classics, savory pies, Sunday roasts, and traditional bakes from across Britain.",
      continentId: europe.id,
    },
    {
      name: "Ireland",
      code: "IE",
      cuisineName: "Irish",
      image: "cuisines/irish.webp",
      description:
        "Enjoy warming stews, rustic breads, and hearty dishes that highlight potatoes, seasonal produce, and fresh seafood.",
      continentId: europe.id,
    },
    {
      name: "Poland",
      code: "PL",
      cuisineName: "Polish",
      image: "cuisines/polish.webp",
      description:
        "Explore comforting dumplings, hearty soups, and traditional dishes featuring cabbage, mushrooms, and savory fillings.",
      continentId: europe.id,
    },
    {
      name: "Sweden",
      code: "SE",
      cuisineName: "Swedish",
      image: "cuisines/swedish.webp",
      description:
        "Discover comforting Nordic dishes, fresh seafood, and traditional bakes with seasonal ingredients and balanced flavors.",
      continentId: europe.id,
    },
    // North America
    {
      name: "United States",
      code: "US",
      cuisineName: "American",
      image: "cuisines/american.webp",
      description:
        "Explore diverse regional favorites, from smoky barbecue and comforting classics to dishes shaped by generations of cultural exchange.",
      continentId: northAmerica.id,
    },
    {
      name: "Mexico",
      code: "MX",
      cuisineName: "Mexican",
      image: "cuisines/mexican.webp",
      description:
        "Enjoy vibrant dishes featuring corn, beans, chilies, and fresh salsas, with rich flavors rooted in regional traditions.",
      continentId: northAmerica.id,
    },
    {
      name: "Canada",
      code: "CA",
      cuisineName: "Canadian",
      image: "cuisines/canadian.webp",
      description:
        "Discover comforting regional favorites featuring fresh seafood, seasonal produce, and the sweetness of maple syrup.",
      continentId: northAmerica.id,
    },
    {
      name: "Jamaica",
      code: "JM",
      cuisineName: "Jamaican",
      image: "cuisines/jamaican.webp",
      description:
        "Explore bold Caribbean flavors with fragrant jerk spices, slow-cooked stews, and satisfying rice dishes.",
      continentId: northAmerica.id,
    },
    {
      name: "Cuba",
      code: "CU",
      cuisineName: "Cuban",
      image: "cuisines/cuban.webp",
      description:
        "Enjoy comforting dishes featuring savory rice, beans, slow-cooked meats, and sweet or crispy plantains.",
      continentId: northAmerica.id,
    },
    // South America
    {
      name: "Brazil",
      code: "BR",
      cuisineName: "Brazilian",
      image: "cuisines/brazilian.webp",
      description:
        "Discover diverse regional dishes featuring hearty beans, grilled meats, cassava, and vibrant tropical ingredients.",
      continentId: southAmerica.id,
    },
    {
      name: "Argentina",
      code: "AR",
      cuisineName: "Argentinian",
      image: "cuisines/argentinian.webp",
      description:
        "Enjoy grilled specialties, savory empanadas, and comforting dishes influenced by local traditions and European cooking.",
      continentId: southAmerica.id,
    },
    {
      name: "Peru",
      code: "PE",
      cuisineName: "Peruvian",
      image: "cuisines/peruvian.webp",
      description:
        "Explore vibrant dishes featuring fresh seafood, native potatoes, and bold chilies shaped by diverse culinary traditions.",
      continentId: southAmerica.id,
    },
    {
      name: "Colombia",
      code: "CO",
      cuisineName: "Colombian",
      image: "cuisines/colombian.webp",
      description:
        "Discover hearty soups, comforting rice dishes, and traditional corn-based favorites from Colombia's diverse regions.",
      continentId: southAmerica.id,
    },
    // Africa
    {
      name: "Morocco",
      code: "MA",
      cuisineName: "Moroccan",
      image: "cuisines/moroccan.webp",
      description:
        "Enjoy fragrant tagines, fluffy couscous, and warming dishes that combine aromatic spices with savory and sweet flavors.",
      continentId: africa.id,
    },
    {
      name: "Egypt",
      code: "EG",
      cuisineName: "Egyptian",
      image: "cuisines/egyptian.webp",
      description:
        "Discover comforting dishes featuring beans, lentils, rice, and fragrant seasonings rooted in everyday Egyptian cooking.",
      continentId: africa.id,
    },
    {
      name: "Ethiopia",
      code: "ET",
      cuisineName: "Ethiopian",
      image: "cuisines/ethiopian.webp",
      description:
        "Explore richly spiced stews and flavorful vegetables served with tangy injera for a shared dining experience.",
      continentId: africa.id,
    },
    {
      name: "Nigeria",
      code: "NG",
      cuisineName: "Nigerian",
      image: "cuisines/nigerian.webp",
      description:
        "Enjoy bold rice dishes, rich soups, and satisfying stews featuring peppers, leafy vegetables, and regional spices.",
      continentId: africa.id,
    },
    {
      name: "South Africa",
      code: "ZA",
      cuisineName: "South African",
      image: "cuisines/south-african.webp",
      description:
        "Discover diverse dishes, from braai favorites to fragrant curries and comforting stews shaped by many culinary traditions.",
      continentId: africa.id,
    },
    // Oceania
    {
      name: "Australia",
      code: "AU",
      cuisineName: "Australian",
      image: "cuisines/australian.webp",
      description:
        "Explore fresh seafood, barbecue favorites, and modern dishes shaped by local ingredients and multicultural influences.",
      continentId: oceania.id,
    },
    {
      name: "New Zealand",
      code: "NZ",
      cuisineName: "New Zealand",
      image: "cuisines/new-zealand.webp",
      description:
        "Enjoy fresh seafood, tender lamb, and seasonal dishes shaped by Māori traditions and diverse culinary influences.",
      continentId: oceania.id,
    },
  ];

  const countries = new Map<string, number>();

  for (const country of countryData) {
  const savedCountry = await prismaClient.country.upsert({
    where: { code: country.code },
    update: {
      name: country.name,
      cuisineName: country.cuisineName,
      description: country.description,
      image: country.image,
      continentId: country.continentId,
    },
    create: country,
  });

  countries.set(country.code, savedCountry.id);
}

  // 3. Categories
  const categories = new Map<string, number>();

    for (const category of categoryData) {
    // Diet entries don't have an image property.
    const image = "image" in category ? category.image : null;

    const savedCategory = await prismaClient.category.upsert({
      where: { name: category.name },
      update: {
        type: category.type,
        image,
      },
      create: {
        name: category.name,
        type: category.type,
        image,
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
