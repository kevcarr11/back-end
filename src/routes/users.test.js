const request = require("supertest");
const server = require("../server");
const bcrypt = require("bcryptjs");
const db = require("../db");
const salt = require("../salt");

beforeAll(async () => {
  await db.raw('TRUNCATE "cities" RESTART IDENTITY CASCADE;');
  await db.raw('TRUNCATE "categories" RESTART IDENTITY CASCADE;');
  await db.raw('TRUNCATE "restaurants" RESTART IDENTITY CASCADE;');
  await db.raw('TRUNCATE "users" RESTART IDENTITY CASCADE;');
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

const createRest = rest => {
  return {
    name: "Whattaburger",
    city: 1,
    category: 1,
    phone: "1238675309",
    address: "123 Tasty Ln",
    week: "8:00am - 6:00pm",
    weekend: "12:00pm - 2:00am",
    ...rest
  };
};

const defaultRest = createRest();

const createUser = user => ({
  firstName: "Matt",
  lastName: "Hagner",
  password: "abadpassword",
  email: "example@example.com",
  city: 1,
  ...user
});

const defaultUser = createUser();

const createLogin = login => ({
  email: defaultUser.email,
  password: "abadpassword",
  ...login
});

const defaultLogin = createLogin();

describe("GET /api/users/restaurants", () => {
  it("should return only the restaurants from the users city", async done => {
    try {
      await db.from("cities").insert({ name: "Austin" });
      await db.from("cities").insert({ name: "Memphis" });
      await db.from("categories").insert({ name: "Tex-Mex", image: "yay" });

      await db.from("restaurants").insert(defaultRest);
      await db.from("restaurants").insert(createRest({ city: 2 }));

      await db.from("users").insert(
        createUser({
          password: bcrypt.hashSync(defaultUser.password, salt())
        })
      );

      const res = await request(server)
        .post("/api/auth/login")
        .send(defaultLogin);

      const { token } = res.body;

      const res2 = await request(server)
        .get("/api/users/restaurants")
        .set("Authorization", token);

      expect(res2.body.restaurants.length).toBe(1);

      done();
    } catch (err) {
      console.error(err);
      done();
    }
  });
});
