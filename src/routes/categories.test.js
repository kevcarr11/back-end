const request = require("supertest");
const server = require("../server");
const db = require("../db");
const admin = require("../admin");

beforeAll(async () => {
  await db.raw('TRUNCATE "categories" RESTART IDENTITY CASCADE;');
});

beforeEach(async () => {
  await db.from("categories").insert([
    {
      name: "Tex-Mex"
    },
    {
      name: "Greek"
    }
  ]);
});

afterEach(async () => {
  await db.raw('TRUNCATE "categories" RESTART IDENTITY CASCADE;');
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe("GET /", () => {
  const ENDPOINT = "/api/categories";

  it("should return success", async done => {
    const res = await request(server).get(ENDPOINT);

    expect(res.status).toBe(200);
    expect(res.body.categories.length).toBe(2);
    done();
  });
});

describe("GET /:id", () => {
  const ENDPOINT = "/api/categories/1";

  it("should return successfully", async done => {
    const res = await request(server).get(ENDPOINT);

    expect(res.status).toBe(200);
    expect(res.body.category.name).toBe("Tex-Mex");
    done();
  });

  it("should return unsuccessfully", async done => {
    const res = await request(server).get("/api/categories/10");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No category found with the id 10");
    done();
  });
});

describe("POST /", () => {
  it("should create if admin", async done => {
    const res = await request(server)
      .post("/api/categories")
      .set("Authorization", admin())
      .send({
        name: "Burger Joint"
      });

    expect(res.status).toBe(201);
    expect(res.body.category.name).toBe("Burger Joint");
    done();
  });

  it("should fail if you are not an admin", async done => {
    const res = await request(server)
      .post("/api/categories")
      .send({
        name: "Burger Joint"
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not an admin");
    done();
  });
});

describe("DELETE /:id", () => {
  it("should create if admin", async done => {
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
    done();
  });

  it("should fail if you are not an admin", async done => {
    const res = await request(server)
      .del("/api/categories/1")
      .send({
        id: 1
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized");
    done();
  });
});
