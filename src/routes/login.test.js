const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const server = require("../server");
const db = require("../db");
const salt = require("../salt");

const createUser = user => ({
  firstName: "Matt",
  lastName: "Hagner",
  password: bcrypt.hashSync("abadpassword", salt()),
  email: "example@example.com",
  city: 1,
  ...user
});

const defaultUser = createUser();

beforeEach(async () => {
  await db.from("users").truncate();

  await db.from("users").insert(defaultUser);
});

const createLogin = login => ({
  email: defaultUser.email,
  password: "abadpassword",
  ...login
});

const defaultLogin = createLogin();

const badLogin = createLogin({
  email: "fishead@example.com",
  password: "reallygoodpassword"
});

describe("POST /api/auth/login", () => {
  const ENDPOINT = "/api/auth/login";

  it("should return a status of 200 if successful", async () => {
    const res = await request(server)
      .post(ENDPOINT)
      .send(defaultLogin);

    expect(res.status).toBe(200);
  });

  it("should return a jwt with the user token", async () => {
    const res = await request(server)
      .post(ENDPOINT)
      .send(defaultLogin);

    const { token } = res.body;
    const decoded = jwt.decode(token);
    expect(decoded.sub).toBe(1);
  });

  it("should validate user input", async () => {
    const res1 = await request(server).post(ENDPOINT);

    expect(res1.status).toBe(400);
    expect(res1.body.message).toBe("Please provide an email and password");

    const res2 = await request(server)
      .post(ENDPOINT)
      .send({ email: "george@gmail.com" });

    expect(res2.status).toBe(400);
    expect(res2.body.message).toBe("Password is required");

    const res3 = await request(server)
      .post(ENDPOINT)
      .send({ password: "apassword" });

    expect(res3.status).toBe(400);
    expect(res3.body.message).toBe("Email is required");
  });

  it("should return a 401 when the user login info is incorrect", async () => {
    const res = await request(server)
      .post(ENDPOINT)
      .send(badLogin);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid login credentials");
  });
});
