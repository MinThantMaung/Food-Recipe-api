import { prismaClient } from "../src/lib/prisma";

type SeedRecipe = {
  title: string;
  slug: string;
  description: string;
  countryCode: string;
  meal: "Breakfast" | "Lunch" | "Dinner";
  prepTime: number;
  cookingTime: number;
  servings: number;
  ingredients: [name: string, quantityText: string][];
  steps: [title: string, instruction: string][];
};

const countries = [
  {
    name: "Myanmar",
    code: "MM",
    cuisineName: "Burmese",
    continent: "Asia",
  },
  {
    name: "Thailand",
    code: "TH",
    cuisineName: "Thai",
    continent: "Asia",
  },
  {
    name: "Japan",
    code: "JP",
    cuisineName: "Japanese",
    continent: "Asia",
  },
  {
    name: "Italy",
    code: "IT",
    cuisineName: "Italian",
    continent: "Europe",
  },
];

const recipes: SeedRecipe[] = [
  {
    title: "Burmese Chicken Curry",
    slug: "burmese-chicken-curry",
    description:
      "Chicken simmered with onions, tomatoes, ginger, and warming spices.",
    countryCode: "MM",
    meal: "Dinner",
    prepTime: 15,
    cookingTime: 40,
    servings: 4,
    ingredients: [
      ["Chicken thigh", "600 g, boneless and cut into pieces"],
      ["Onion", "2, finely chopped"],
      ["Tomato", "3, chopped"],
      ["Garlic", "4 cloves, minced"],
      ["Ginger", "1 tablespoon, grated"],
      ["Turmeric", "1 teaspoon"],
      ["Paprika", "2 teaspoons"],
      ["Fish sauce", "1 tablespoon"],
      ["Vegetable oil", "3 tablespoons"],
      ["Water", "250 ml"],
    ],
    steps: [
      [
        "Season the chicken",
        "Mix the chicken with turmeric, paprika, and fish sauce.",
      ],
      [
        "Cook the curry base",
        "Heat the oil in a saucepan. Cook the onions until softened and golden. Add garlic and ginger, stir for 1 minute, then add tomatoes and cook until softened.",
      ],
      [
        "Simmer",
        "Add the chicken and stir for 5 minutes. Pour in the water, cover, and simmer for 25–30 minutes until the chicken is cooked through. Uncover briefly to thicken the sauce.",
      ],
    ],
  },
  {
    title: "Burmese Tomato Salad",
    slug: "burmese-tomato-salad",
    description:
      "A fresh tomato salad with lime, roasted peanuts, and crispy shallots.",
    countryCode: "MM",
    meal: "Lunch",
    prepTime: 15,
    cookingTime: 0,
    servings: 2,
    ingredients: [
      ["Tomato", "4, thinly sliced"],
      ["Shallot", "1, thinly sliced"],
      ["Roasted peanut", "3 tablespoons, crushed"],
      ["Lime juice", "2 tablespoons"],
      ["Fish sauce", "2 teaspoons"],
      ["Chickpea flour", "1 tablespoon, roasted"],
      ["Fried shallot", "2 tablespoons"],
      ["Cilantro", "2 tablespoons, chopped"],
    ],
    steps: [
      [
        "Prepare the vegetables",
        "Place the sliced tomatoes and shallot in a mixing bowl.",
      ],
      [
        "Dress the salad",
        "Add lime juice, fish sauce, roasted chickpea flour, and peanuts. Toss gently.",
      ],
      [
        "Serve",
        "Scatter the fried shallots and cilantro over the salad. Serve immediately.",
      ],
    ],
  },
  {
    title: "Burmese Coconut Chicken Noodles",
    slug: "burmese-coconut-chicken-noodles",
    description:
      "Egg noodles served in a rich coconut chicken broth.",
    countryCode: "MM",
    meal: "Dinner",
    prepTime: 20,
    cookingTime: 30,
    servings: 4,
    ingredients: [
      ["Egg noodles", "300 g"],
      ["Chicken thigh", "400 g, thinly sliced"],
      ["Coconut milk", "400 ml"],
      ["Chicken stock", "700 ml"],
      ["Onion", "1, chopped"],
      ["Garlic", "3 cloves, minced"],
      ["Chickpea flour", "2 tablespoons"],
      ["Turmeric", "1/2 teaspoon"],
      ["Fish sauce", "1 tablespoon"],
      ["Vegetable oil", "2 tablespoons"],
      ["Lime", "1, cut into wedges"],
    ],
    steps: [
      [
        "Cook the chicken base",
        "Heat the oil and soften the onion. Add garlic and turmeric, then add chicken and cook for 5 minutes.",
      ],
      [
        "Make the broth",
        "Mix chickpea flour with a little cold stock until smooth. Add it to the pan with the remaining stock, coconut milk, and fish sauce. Simmer gently for 20 minutes until the chicken is cooked through.",
      ],
      [
        "Assemble",
        "Cook the noodles according to the package directions and drain. Divide among bowls, ladle over the broth, and serve with lime wedges.",
      ],
    ],
  },
  {
    title: "Burmese Chickpea Rice",
    slug: "burmese-chickpea-rice",
    description:
      "Fragrant rice cooked with chickpeas, onion, and turmeric.",
    countryCode: "MM",
    meal: "Lunch",
    prepTime: 10,
    cookingTime: 25,
    servings: 4,
    ingredients: [
      ["Jasmine rice", "300 g, rinsed"],
      ["Cooked chickpea", "240 g, drained"],
      ["Onion", "1, thinly sliced"],
      ["Turmeric", "1/2 teaspoon"],
      ["Vegetable oil", "2 tablespoons"],
      ["Water", "450 ml"],
      ["Salt", "1/2 teaspoon"],
    ],
    steps: [
      [
        "Cook the onion",
        "Heat the oil in a saucepan with a tight-fitting lid. Cook the onion until soft, then stir in turmeric.",
      ],
      [
        "Add the rice",
        "Add rice, chickpeas, water, and salt. Stir once and bring to a boil.",
      ],
      [
        "Steam",
        "Cover and reduce to low heat. Cook for 15 minutes, then turn off the heat and rest, covered, for 10 minutes. Fluff gently before serving.",
      ],
    ],
  },
  {
    title: "Burmese Egg Curry",
    slug: "burmese-egg-curry",
    description:
      "Boiled eggs in a tomato and onion curry sauce.",
    countryCode: "MM",
    meal: "Dinner",
    prepTime: 10,
    cookingTime: 30,
    servings: 3,
    ingredients: [
      ["Egg", "6"],
      ["Onion", "1, finely chopped"],
      ["Tomato", "4, chopped"],
      ["Garlic", "3 cloves, minced"],
      ["Turmeric", "1/2 teaspoon"],
      ["Paprika", "1 teaspoon"],
      ["Fish sauce", "2 teaspoons"],
      ["Vegetable oil", "3 tablespoons"],
      ["Water", "150 ml"],
    ],
    steps: [
      [
        "Boil the eggs",
        "Place the eggs in boiling water and cook for 10–12 minutes. Cool in cold water, peel, and pat dry.",
      ],
      [
        "Make the sauce",
        "Heat the oil and soften the onion. Add garlic, turmeric, and paprika. Stir briefly, then add tomatoes, fish sauce, and water. Simmer for 10 minutes.",
      ],
      [
        "Finish the curry",
        "Add the eggs and simmer gently for 5 minutes, turning them to coat in the sauce.",
      ],
    ],
  },
  {
    title: "Thai Basil Chicken",
    slug: "thai-basil-chicken",
    description:
      "A quick chicken stir-fry with garlic, chili, and fragrant basil.",
    countryCode: "TH",
    meal: "Dinner",
    prepTime: 10,
    cookingTime: 10,
    servings: 2,
    ingredients: [
      ["Ground chicken", "300 g"],
      ["Thai basil", "1 packed cup"],
      ["Garlic", "4 cloves, chopped"],
      ["Red chili", "1, chopped"],
      ["Oyster sauce", "1 tablespoon"],
      ["Soy sauce", "2 teaspoons"],
      ["Fish sauce", "1 teaspoon"],
      ["Sugar", "1/2 teaspoon"],
      ["Vegetable oil", "1 tablespoon"],
      ["Water", "2 tablespoons"],
    ],
    steps: [
      [
        "Mix the sauce",
        "Combine oyster sauce, soy sauce, fish sauce, sugar, and water in a small bowl.",
      ],
      [
        "Stir-fry",
        "Heat the oil in a wok. Fry garlic and chili briefly, then add ground chicken. Break it up and stir-fry until cooked through.",
      ],
      [
        "Add basil",
        "Pour in the sauce and toss for 1 minute. Stir in basil until just wilted and serve.",
      ],
    ],
  },
  {
    title: "Thai Green Chicken Curry",
    slug: "thai-green-chicken-curry",
    description:
      "Chicken and vegetables simmered in a fragrant green coconut curry.",
    countryCode: "TH",
    meal: "Dinner",
    prepTime: 15,
    cookingTime: 25,
    servings: 4,
    ingredients: [
      ["Chicken thigh", "500 g, sliced"],
      ["Green curry paste", "3 tablespoons"],
      ["Coconut milk", "400 ml"],
      ["Chicken stock", "200 ml"],
      ["Eggplant", "1, cubed"],
      ["Green bean", "150 g, trimmed"],
      ["Thai basil", "1/2 cup"],
      ["Fish sauce", "1 tablespoon"],
      ["Sugar", "1 teaspoon"],
      ["Vegetable oil", "1 tablespoon"],
    ],
    steps: [
      [
        "Cook the paste",
        "Heat the oil in a saucepan and stir-fry the curry paste for 1 minute.",
      ],
      [
        "Simmer the curry",
        "Add coconut milk and stock. Bring to a gentle simmer, then add chicken, eggplant, and green beans. Cook for 20 minutes until the chicken is cooked through.",
      ],
      [
        "Season",
        "Add fish sauce and sugar. Stir in basil just before serving.",
      ],
    ],
  },
  {
    title: "Thai Shrimp Fried Rice",
    slug: "thai-shrimp-fried-rice",
    description:
      "Jasmine rice stir-fried with shrimp, egg, and spring onions.",
    countryCode: "TH",
    meal: "Lunch",
    prepTime: 10,
    cookingTime: 10,
    servings: 2,
    ingredients: [
      ["Cooked jasmine rice", "400 g, cooled and refrigerated"],
      ["Shrimp", "200 g, peeled and deveined"],
      ["Egg", "2, beaten"],
      ["Garlic", "2 cloves, minced"],
      ["Spring onion", "2, sliced"],
      ["Fish sauce", "2 teaspoons"],
      ["Soy sauce", "2 teaspoons"],
      ["Vegetable oil", "2 tablespoons"],
      ["Lime", "1, cut into wedges"],
    ],
    steps: [
      [
        "Cook the shrimp",
        "Heat the oil in a wok. Add garlic and shrimp, then stir-fry until the shrimp are opaque.",
      ],
      [
        "Add egg and rice",
        "Push the shrimp aside and scramble the eggs in the pan. Add rice, breaking apart any clumps.",
      ],
      [
        "Season and serve",
        "Add fish sauce and soy sauce. Stir-fry until the rice is steaming hot throughout. Toss in spring onions and serve with lime.",
      ],
    ],
  },
  {
    title: "Thai Red Tofu Curry",
    slug: "thai-red-tofu-curry",
    description:
      "Tofu and colorful vegetables in a creamy red curry sauce.",
    countryCode: "TH",
    meal: "Dinner",
    prepTime: 15,
    cookingTime: 20,
    servings: 3,
    ingredients: [
      ["Firm tofu", "400 g, drained and cubed"],
      ["Red curry paste", "2 tablespoons"],
      ["Coconut milk", "400 ml"],
      ["Vegetable stock", "150 ml"],
      ["Red bell pepper", "1, sliced"],
      ["Zucchini", "1, sliced"],
      ["Soy sauce", "1 tablespoon"],
      ["Sugar", "1 teaspoon"],
      ["Vegetable oil", "1 tablespoon"],
    ],
    steps: [
      [
        "Fry the paste",
        "Heat the oil in a saucepan. Stir in the curry paste and cook for 1 minute.",
      ],
      [
        "Cook the vegetables",
        "Add coconut milk, stock, bell pepper, and zucchini. Simmer for 10 minutes.",
      ],
      [
        "Add the tofu",
        "Gently stir in tofu, soy sauce, and sugar. Simmer for another 5–8 minutes until heated through.",
      ],
    ],
  },
  {
    title: "Thai Chicken Rice Soup",
    slug: "thai-chicken-rice-soup",
    description:
      "A comforting rice soup with chicken, ginger, and fresh herbs.",
    countryCode: "TH",
    meal: "Breakfast",
    prepTime: 10,
    cookingTime: 20,
    servings: 2,
    ingredients: [
      ["Cooked jasmine rice", "250 g"],
      ["Ground chicken", "200 g"],
      ["Chicken stock", "900 ml"],
      ["Ginger", "1 tablespoon, finely sliced"],
      ["Garlic", "2 cloves, minced"],
      ["Fish sauce", "2 teaspoons"],
      ["Spring onion", "2, sliced"],
      ["Cilantro", "2 tablespoons, chopped"],
    ],
    steps: [
      [
        "Prepare the broth",
        "Bring the stock to a simmer with ginger and garlic.",
      ],
      [
        "Cook the chicken",
        "Add small spoonfuls of ground chicken and simmer for 8–10 minutes until cooked through.",
      ],
      [
        "Add rice",
        "Stir in cooked rice and fish sauce. Simmer for another 5 minutes, then top with spring onions and cilantro.",
      ],
    ],
  },
  {
    title: "Chicken Teriyaki",
    slug: "chicken-teriyaki",
    description:
      "Pan-seared chicken coated in a glossy sweet and savory sauce.",
    countryCode: "JP",
    meal: "Dinner",
    prepTime: 10,
    cookingTime: 20,
    servings: 2,
    ingredients: [
      ["Chicken thigh", "400 g, boneless"],
      ["Soy sauce", "2 tablespoons"],
      ["Mirin", "2 tablespoons"],
      ["Sake", "2 tablespoons"],
      ["Sugar", "1 tablespoon"],
      ["Vegetable oil", "1 teaspoon"],
    ],
    steps: [
      [
        "Mix the sauce",
        "Combine soy sauce, mirin, sake, and sugar.",
      ],
      [
        "Cook the chicken",
        "Heat oil in a frying pan. Cook the chicken skin-side down until golden, then turn and cook through, lowering the heat as needed.",
      ],
      [
        "Glaze",
        "Remove excess fat from the pan. Add the sauce and simmer, turning the chicken until coated and the sauce has thickened. Slice to serve.",
      ],
    ],
  },
  {
    title: "Japanese Chicken Curry",
    slug: "japanese-chicken-curry",
    description:
      "A mild, thick chicken curry with potatoes, carrots, and onions.",
    countryCode: "JP",
    meal: "Dinner",
    prepTime: 15,
    cookingTime: 35,
    servings: 4,
    ingredients: [
      ["Chicken thigh", "500 g, cubed"],
      ["Onion", "2, sliced"],
      ["Carrot", "2, chopped"],
      ["Potato", "2, cubed"],
      ["Japanese curry roux", "90 g, or according to package"],
      ["Water", "700 ml, adjust according to roux package"],
      ["Vegetable oil", "1 tablespoon"],
    ],
    steps: [
      [
        "Brown the ingredients",
        "Heat the oil in a saucepan. Cook onions until softened, then add chicken and brown lightly.",
      ],
      [
        "Simmer",
        "Add carrots, potatoes, and water. Bring to a boil, reduce heat, and simmer for 20 minutes until the vegetables are tender and chicken is cooked through.",
      ],
      [
        "Thicken",
        "Turn off the heat and dissolve the curry roux into the liquid. Return to low heat and simmer for 5 minutes, stirring frequently.",
      ],
    ],
  },
  {
    title: "Salmon Onigiri",
    slug: "salmon-onigiri",
    description:
      "Japanese rice balls filled with cooked salmon and wrapped in nori.",
    countryCode: "JP",
    meal: "Lunch",
    prepTime: 20,
    cookingTime: 15,
    servings: 2,
    ingredients: [
      ["Cooked Japanese rice", "450 g, freshly cooked and slightly cooled"],
      ["Salmon", "150 g, boneless"],
      ["Nori", "2 sheets, cut into strips"],
      ["Salt", "1/2 teaspoon"],
      ["Sesame seed", "1 teaspoon"],
    ],
    steps: [
      [
        "Cook the salmon",
        "Season salmon with a little salt and bake at 200°C for 12–15 minutes until cooked through. Flake and remove any bones.",
      ],
      [
        "Shape the rice",
        "Moisten your hands and rub with a little salt. Divide rice into four portions. Place salmon in the center of each and gently shape into triangles.",
      ],
      [
        "Wrap",
        "Sprinkle with sesame seeds and wrap each rice ball with nori. Serve promptly.",
      ],
    ],
  },
  {
    title: "Vegetable Yakisoba",
    slug: "vegetable-yakisoba",
    description:
      "Stir-fried noodles with cabbage, carrots, and mushrooms.",
    countryCode: "JP",
    meal: "Lunch",
    prepTime: 15,
    cookingTime: 10,
    servings: 2,
    ingredients: [
      ["Yakisoba noodles", "300 g"],
      ["Cabbage", "200 g, sliced"],
      ["Carrot", "1, cut into thin strips"],
      ["Onion", "1/2, sliced"],
      ["Mushroom", "100 g, sliced"],
      ["Yakisoba sauce", "3 tablespoons"],
      ["Vegetable oil", "1 tablespoon"],
      ["Water", "2 tablespoons"],
    ],
    steps: [
      [
        "Prepare the noodles",
        "Loosen the noodles according to the package directions.",
      ],
      [
        "Stir-fry the vegetables",
        "Heat oil in a wok. Cook onion, carrot, cabbage, and mushrooms for 4–5 minutes.",
      ],
      [
        "Toss together",
        "Add noodles and water. Stir-fry until hot, then add yakisoba sauce and toss until evenly coated.",
      ],
    ],
  },
  {
    title: "Tamagoyaki",
    slug: "tamagoyaki",
    description:
      "A tender Japanese rolled omelet with a gently sweet flavor.",
    countryCode: "JP",
    meal: "Breakfast",
    prepTime: 5,
    cookingTime: 10,
    servings: 2,
    ingredients: [
      ["Egg", "4"],
      ["Dashi", "2 tablespoons"],
      ["Sugar", "2 teaspoons"],
      ["Soy sauce", "1/2 teaspoon"],
      ["Vegetable oil", "2 teaspoons"],
    ],
    steps: [
      [
        "Mix the eggs",
        "Beat eggs gently with dashi, sugar, and soy sauce.",
      ],
      [
        "Cook and roll",
        "Lightly oil a small nonstick pan over medium-low heat. Pour in a thin layer of egg. Once mostly set, roll it toward one end of the pan.",
      ],
      [
        "Build the layers",
        "Oil the exposed pan and add another thin layer, lifting the roll so egg flows beneath it. Roll again and repeat until all the egg is used and cooked. Rest briefly and slice.",
      ],
    ],
  },
  {
    title: "Spaghetti Aglio e Olio",
    slug: "spaghetti-aglio-e-olio",
    description:
      "Spaghetti tossed with olive oil, garlic, chili, and parsley.",
    countryCode: "IT",
    meal: "Dinner",
    prepTime: 5,
    cookingTime: 15,
    servings: 2,
    ingredients: [
      ["Spaghetti", "200 g"],
      ["Garlic", "4 cloves, thinly sliced"],
      ["Olive oil", "3 tablespoons"],
      ["Chili flakes", "1/2 teaspoon"],
      ["Parsley", "2 tablespoons, chopped"],
      ["Salt", "for the pasta water"],
    ],
    steps: [
      [
        "Boil the pasta",
        "Cook spaghetti in salted water until al dente. Reserve a cup of cooking water before draining.",
      ],
      [
        "Infuse the oil",
        "Gently heat olive oil and garlic in a large pan until the garlic is pale golden. Add chili flakes.",
      ],
      [
        "Toss",
        "Add pasta and a splash of cooking water. Toss until glossy, adding more water as needed. Finish with parsley.",
      ],
    ],
  },
  {
    title: "Penne Arrabbiata",
    slug: "penne-arrabbiata",
    description:
      "Penne in a spicy tomato sauce with garlic and parsley.",
    countryCode: "IT",
    meal: "Dinner",
    prepTime: 10,
    cookingTime: 20,
    servings: 2,
    ingredients: [
      ["Penne", "200 g"],
      ["Canned tomato", "400 g, crushed"],
      ["Garlic", "3 cloves, sliced"],
      ["Chili flakes", "1 teaspoon"],
      ["Olive oil", "2 tablespoons"],
      ["Parsley", "2 tablespoons, chopped"],
      ["Salt", "to taste and for the pasta water"],
    ],
    steps: [
      [
        "Start the sauce",
        "Heat olive oil and gently cook garlic and chili flakes for 1 minute. Add tomatoes and simmer for 15 minutes. Season with salt.",
      ],
      [
        "Cook the pasta",
        "Meanwhile, cook penne in salted boiling water until al dente. Reserve some cooking water and drain.",
      ],
      [
        "Combine",
        "Toss the pasta with the sauce, adding a little pasta water if needed. Finish with parsley.",
      ],
    ],
  },
  {
    title: "Caprese Salad",
    slug: "caprese-salad",
    description:
      "Fresh tomatoes, mozzarella, and basil dressed with olive oil.",
    countryCode: "IT",
    meal: "Lunch",
    prepTime: 10,
    cookingTime: 0,
    servings: 2,
    ingredients: [
      ["Tomato", "3 large, sliced"],
      ["Fresh mozzarella", "200 g, sliced"],
      ["Fresh basil", "12 leaves"],
      ["Olive oil", "2 tablespoons"],
      ["Salt", "to taste"],
      ["Black pepper", "to taste"],
    ],
    steps: [
      [
        "Slice",
        "Slice the tomatoes and mozzarella into similar-sized rounds.",
      ],
      [
        "Arrange",
        "Alternate tomato and mozzarella slices on a plate, adding basil leaves between them.",
      ],
      [
        "Dress",
        "Drizzle with olive oil and season with salt and black pepper. Serve immediately.",
      ],
    ],
  },
  {
    title: "Mushroom Risotto",
    slug: "mushroom-risotto",
    description:
      "Creamy arborio rice cooked with mushrooms and Parmesan.",
    countryCode: "IT",
    meal: "Dinner",
    prepTime: 15,
    cookingTime: 30,
    servings: 3,
    ingredients: [
      ["Arborio rice", "250 g"],
      ["Mushroom", "250 g, sliced"],
      ["Onion", "1, finely chopped"],
      ["Vegetable stock", "1 liter, kept hot"],
      ["Butter", "30 g"],
      ["Olive oil", "1 tablespoon"],
      ["Parmesan", "50 g, grated"],
      ["Black pepper", "to taste"],
    ],
    steps: [
      [
        "Cook the vegetables",
        "Heat olive oil and half the butter in a wide saucepan. Soften the onion, then add mushrooms and cook until their liquid evaporates.",
      ],
      [
        "Cook the rice",
        "Stir in rice for 1 minute. Add hot stock one ladle at a time, stirring frequently and allowing most of each addition to absorb before adding more. Cook for about 18–22 minutes until tender with a slight bite.",
      ],
      [
        "Finish",
        "Remove from heat. Stir in the remaining butter, Parmesan, and black pepper. Add a little extra stock if needed for a loose, creamy texture.",
      ],
    ],
  },
  {
    title: "Tomato Basil Bruschetta",
    slug: "tomato-basil-bruschetta",
    description:
      "Toasted bread topped with juicy tomatoes, basil, and olive oil.",
    countryCode: "IT",
    meal: "Lunch",
    prepTime: 10,
    cookingTime: 5,
    servings: 2,
    ingredients: [
      ["Rustic bread", "4 slices"],
      ["Tomato", "3, diced"],
      ["Fresh basil", "8 leaves, torn"],
      ["Garlic", "1 clove, halved"],
      ["Olive oil", "2 tablespoons"],
      ["Salt", "to taste"],
      ["Black pepper", "to taste"],
    ],
    steps: [
      [
        "Prepare the topping",
        "Combine tomatoes, basil, 1 tablespoon olive oil, salt, and black pepper.",
      ],
      [
        "Toast the bread",
        "Brush bread with the remaining oil and toast under a grill until golden, watching carefully.",
      ],
      [
        "Assemble",
        "Rub the warm toast with the cut garlic. Spoon over the tomato mixture and serve immediately.",
      ],
    ],
  },
];

async function main() {
  const countryIds = new Map<string, number>();
  const mealIds = new Map<string, number>();

  // Create missing continents and countries.
  for (const country of countries) {
    const continent = await prismaClient.continent.upsert({
      where: { name: country.continent },
      update: {},
      create: { name: country.continent },
    });

    const savedCountry = await prismaClient.country.upsert({
      where: { code: country.code },
      update: {},
      create: {
        name: country.name,
        code: country.code,
        cuisineName: country.cuisineName,
        continentId: continent.id,
      },
    });

    countryIds.set(country.code, savedCountry.id);
  }

  // Reuse existing meal categories.
  for (const name of ["Breakfast", "Lunch", "Dinner"]) {
    const category = await prismaClient.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        type: "MEAL",
      },
    });

    if (category.type !== "MEAL") {
      throw new Error(
        `Category "${name}" already exists with type "${category.type}".`,
      );
    }

    mealIds.set(name, category.id);
  }

  // Process sequentially so shared ingredient names are reused.
  for (const recipe of recipes) {
    const countryId = countryIds.get(recipe.countryCode);
    const categoryId = mealIds.get(recipe.meal);

    if (countryId === undefined || categoryId === undefined) {
      throw new Error(`Missing country or meal for "${recipe.title}".`);
    }

    // A nested write creates the recipe and its related rows atomically.
    await prismaClient.recipe.upsert({
      where: {
        slug: recipe.slug,
      },

      // Preserve existing recipes and their related data.
      update: {},

      create: {
        title: recipe.title,
        slug: recipe.slug,
        description: recipe.description,
        prepTime: recipe.prepTime,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,

        country: {
          connect: { id: countryId },
        },

        recipeCategories: {
          create: {
            category: {
              connect: { id: categoryId },
            },
          },
        },

        recipeIngredients: {
          create: recipe.ingredients.map(
            ([name, quantityText], index) => ({
              position: index + 1,
              quantityText,
              ingredient: {
                connectOrCreate: {
                  where: { name },
                  create: { name },
                },
              },
            }),
          ),
        },

        recipeSteps: {
          create: recipe.steps.map(
            ([title, instruction], index) => ({
              stepNumber: index + 1,
              title,
              instruction,
            }),
          ),
        },
      },
    });

    console.log(`Ready: ${recipe.title}`);
  }

  console.log(`Finished processing ${recipes.length} recipes.`);
}

main()
  .catch((error) => {
    console.error("Recipe seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });