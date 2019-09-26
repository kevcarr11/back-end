const Categories = require("./categories");
const db = require("../db");

beforeEach(async () => {
  await db.raw('TRUNCATE "categories" RESTART IDENTITY CASCADE;');
});

it("should create a category", async () => {
  const input = {
    name: "New Category"
  };

  await Categories.create(input);

  const categories = await db.from("categories").select("*");

  expect(categories.length).toBe(1);
  expect(categories[0].name).toBe("New Category");
});

it.skip("should get all categories", async () => {});

it.skip("should update a category", async () => {});

it.skip("should delete a category", async () => {});
