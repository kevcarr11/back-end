const Restaurants = require("./restaurants");
const db = require("../db");

beforeEach(async () => {
  await db.from("cities").insert({ name: "Austin" });
  await db.from("categories").insert({ name: "Tex-Mex", image: "yay" });
});

afterEach(async () => {
  await db.raw('TRUNCATE "cities" RESTART IDENTITY CASCADE;');
  await db.raw('TRUNCATE "categories" RESTART IDENTITY CASCADE;');
  await db.raw('TRUNCATE "restaurants" RESTART IDENTITY CASCADE;');
});

const createRest = rest => {
  return {
    ...rest,
    name: "Whattaburger",
    city: 1,
    category: 1,
    phone: "1238675309",
    address: "123 Tasty Ln",
    week: "8:00am - 6:00pm",
    weekend: "12:00pm - 2:00am"
  };
};

const defaultRest = createRest();

describe("Restaurants controller", () => {
  it("should create a restaurant", async () => {
    const restaurant = await Restaurants.create(defaultRest);

    expect(restaurant.name).toBe(defaultRest.name);
  });

  it("should get a single restaurant", async () => {
    await Restaurants.create(defaultRest);

    const rest = await Restaurants.getById(1);

    expect(rest.name).toBe(defaultRest.name);
  });

  it("should get a single restaurant by name", async () => {
    await Restaurants.create(defaultRest);

    const rest = await Restaurants.getByName(defaultRest.name);

    expect(rest.name).toBe(defaultRest.name);
    expect(rest.phone).toBe(defaultRest.phone);
  });

  it("should get all restaurants", async () => {
    await Restaurants.create(defaultRest);
    await Restaurants.create(createRest({ name: "Gordos" }));

    const rests = await Restaurants.getAll();

    expect(rests.length).toBe(2);
  });

  it("should delete a restaurant by id", async () => {
    await Restaurants.create(defaultRest);
    await Restaurants.create(createRest({ name: "Gordos" }));

    const didDelete = await Restaurants.deleteById(2);

    const restaurants = await db.from("restaurants").select("*");

    expect(restaurants.length).toBe(1);
    expect(didDelete).toBe(true);
  });

  it("should update by id", async () => {
    await Restaurants.create(defaultRest);
    await Restaurants.create(createRest({ name: "Gordos" }));

    const updated = await Restaurants.updateById(2, { name: "Piggly Wiggly" });

    const restaurants = await db.from("restaurants").select("*");

    expect(restaurants[1].name).toBe("Piggly Wiggly");
    expect(updated.name).toBe("Piggly Wiggly");
  });

  it("should return a list of restaurants by city", async () => {
    await Restaurants.create(defaultRest);
    await Restaurants.create(createRest({ name: "Gordos" }));

    const rests = await Restaurants.getRestaurantsByCity(1);

    expect(rests.length).toBe(2);
  });
});
