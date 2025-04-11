// src/scripts/seed.ts
const { PrismaClient } = require("@prisma/client");
const { Faker, en } = require("@faker-js/faker");

const prisma = new PrismaClient();
const faker = new Faker({ locale: [en] });

const generateCategory = () => ({
  name: faker.commerce.department(),
  images: faker.image.urlLoremFlickr({
    category: "business",
    width: 640,
    height: 480,
  }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

const generateProduct = (categoryId) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
  images: [
    faker.image.urlLoremFlickr({
      category: "products",
      width: 640,
      height: 480,
    }),
    faker.image.urlLoremFlickr({
      category: "products",
      width: 640,
      height: 480,
    }),
  ],
  active: faker.datatype.boolean(),
  categoryId,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

async function seedDatabase(categoryCount, productsPerCategory) {
  try {
    console.log(`Starting database seeding...`);
    console.log(`Generating ${categoryCount} categories...`);
    const categories = Array.from({ length: categoryCount }, generateCategory);
    const categoryResult = await prisma.category.createMany({
      data: categories,
      skipDuplicates: true,
    });
    console.log(`Successfully seeded ${categoryResult.count} categories`);

    const createdCategories = await prisma.category.findMany({
      select: { id: true },
    });
    const categoryIds = createdCategories.map((cat) => cat.id);

    if (categoryIds.length === 0) {
      throw new Error("No categories were created, cannot seed products");
    }

    console.log(`Generating ${productsPerCategory} products per category...`);
    const products = [];
    for (const categoryId of categoryIds) {
      const categoryProducts = Array.from({ length: productsPerCategory }, () =>
        generateProduct(categoryId)
      );
      products.push(...categoryProducts);
    }

    const productResult = await prisma.product.createMany({ data: products });
    console.log(`Successfully seeded ${productResult.count} products`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase(5, 20).then(() => console.log("Seeding complete"));
