const request = require("supertest");
const server = require("../server");
const db = require("../db");
const admin = require("../admin");

beforeEach(async () => {
  await db.raw('TRUNCATE "restaurants" RESTART IDENTITY CASCADE;');
});

const createRest = rest => ({
  ...rest,
  name: "Whattaburger",
  city: 1,
  category: 1,
  phone: "1238675309",
  address: "123 Tasty Ln",
  week: "8:00am - 6:00pm",
  weekend: "12:00pm - 2:00am"
});

const defaultRest = createRest();

describe("POST /", () => {
  it("should create if admin", async () => {
    const res = await request(server)
      .post("/api/restaurants")
      .send(defaultRest)
      .set("Authorization", admin());

    const rests = await db.from("restaurants").select("*");

    expect(rests.length).toBe(1);
    expect(res.status).toBe(201);
    expect(res.body.restaurant.name).toBe(defaultRest.name);
  });
});

describe("GET /", () => {
  it("should get all restaurants", async () => {
    await request(server)
      .post("/api/restaurants")
      .send(createRest())
      .set("Authorization", admin());
    await request(server)
      .post("/api/restaurants")
      .send(createRest({ name: "Gordos" }))
      .set("Authorization", admin());

    const res = await request(server).get("/api/restaurants");

    expect(res.body.restaurants.length).toBe(2);
  });
});
