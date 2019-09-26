const request = require("supertest");
const server = require("../server");
const db = require("../db");
const admin = require("../admin");

beforeEach(async () => {
  await db.raw('TRUNCATE "categories" RESTART IDENTITY CASCADE;');

  await db.from("categories").insert([
    {
      name: "Tex-Mex"
    },
    {
      name: "Greek"
    }
  ]);
});

describe("GET /", () => {
  const ENDPOINT = "/api/categories";

  it("should return success", async () => {
    const res = await request(server).get(ENDPOINT);

    expect(res.status).toBe(200);
    expect(res.body.categories.length).toBe(2);
  });
});

describe("GET /:id", () => {
  const ENDPOINT = "/api/categories/1";

  it("should return successfully", async () => {
    const res = await request(server).get(ENDPOINT);

    expect(res.status).toBe(200);
    expect(res.body.category.name).toBe("Tex-Mex");
  });

  it("should return unsuccessfully", async () => {
    const res = await request(server).get("/api/categories/10");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No category found with the id 10");
  });
});

describe("POST /", () => {
  it("should create if admin", async () => {
    const res = await request(server)
      .post("/api/categories")
      .set("Authorization", admin())
      .send({
        name: "Burger Joint"
      });

    expect(res.status).toBe(201);
    expect(res.body.category.name).toBe("Burger Joint");
  });

  it("should fail if you are not an admin", async () => {
    const res = await request(server)
      .post("/api/categories")
      .send({
        name: "Burger Joint"
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not an admin");
  });
});

describe("DELETE /:id", () => {
  it("should create if admin", async () => {
    const res = await request(server)
      .del("/api/categories/1")
      .set("Authorization", admin())
      .send({
        id: 1
      });

    expect(res.status).toBe(200);

    const categories = await db.from("categories").select("*");

    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe("Greek");
  });

  it("should fail if you are not an admin", async () => {
    const res = await request(server)
      .del("/api/categories/1")
      .send({
        id: 1
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized");
  });
});
