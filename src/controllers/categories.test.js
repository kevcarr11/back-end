const Categories = require("./categories");
const db = require("../db");

beforeEach(async () => {
  await db.raw('TRUNCATE "categories" RESTART IDENTITY CASCADE;');
});

afterEach(async () => {
  await db.raw('TRUNCATE "categories" RESTART IDENTITY CASCADE;');
});

it("should create a category", async () => {
  const input = {
    name: "New Category"
  };

  await Categories.create(input);

  const categories = await db.from("categories").select("*");

  expect(categories.length).toBe(1);
  expect(categories[0].name).toBe(input.name);
});

it("should return the category when created", async () => {
  const input = { name: "new category" };
  const category = await Categories.create(input);

  expect(category.name).toBe(input.name);
});

it("should get all categories", async () => {
  await db.from("categories").insert({ name: "cat-1" });
  await db.from("categories").insert({ name: "cat-2" });

  const categories = await Categories.getAll();
  const [cat1, cat2] = categories;

  expect(categories.length).toBe(2);
  expect(cat1.name).toBe("cat-1");
  expect(cat2.name).toBe("cat-2");
});

it("should get category by id", async () => {
  await db.from("categories").insert({ name: "cat-1" });

  const category = await Categories.getById(1);

  expect(category.name).toBe("cat-1");
});

it("should get category by name", async () => {
  await db.from("categories").insert({ name: "cat-1" });

  const category = await Categories.getByName("cat-1");

  expect(category.id).toBe(1);
});

it("should update a category", async () => {
  await db.from("categories").insert({ name: "cat-1" });

  const category = await Categories.updateById(1, { name: "test" });

  expect(category.name).toBe("test");
});

it("should delete a category", async () => {
  await db.from("categories").insert({ name: "cat-1" });

  const deleted = await Categories.deleteById(1);
  const categories = await db.from("categories").select("*");

  expect(deleted).toBe(true);
  expect(categories.length).toBe(0);
});
