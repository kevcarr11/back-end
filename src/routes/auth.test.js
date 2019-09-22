const request = require("supertest");
const jwt = require("jsonwebtoken");
const server = require("../server");
const db = require("../db");

beforeEach(async () => {
  await db.from("users").truncate();
});

// Provides a simple way to override one or more values in the object
const createUser = user => ({
  firstName: "Matt",
  lastName: "Hagner",
  city: 1,
  password: "abadpassword",
  email: "matthagner@gmail.com",
  ...user
});

const defaultUser = createUser();

describe("POST api/auth/register", () => {
  it("should return a 201 on success", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send(defaultUser);

    expect(res.status).toBe(201);
  });

  it("should insert the user into the database", async () => {
    await request(server)
      .post("/api/auth/register")
      .send(defaultUser);

    const users = await db.select("*").from("users");
    const [user] = users;

    expect(users.length).toBe(1);
    expect(user.firstName).toBe("Matt");
    expect(user.lastName).toBe("Hagner");
    expect(user.password).not.toBe("abadpassword");
  });

  it("should return a jwt", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send(createUser());

    const { token } = res.body;

    // We aren't concerned with whether or not the token is valid,
    // but instead just that it contains the information we expect
    // for this test, which is that the sub is equal to the user id
    // that we expect.
    const decoded = jwt.decode(token);

    expect(decoded.sub).toBe(1);
  });

  it("it should validate the user input", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send(createUser({ password: null }));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("password must be at least 8 characters");
  });

  it("should return a 400 if the username is already taken", async () => {
    await request(server)
      .post("/api/auth/register")
      .send(defaultUser);

    const res = await request(server)
      .post("/api/auth/register")
      .send(defaultUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "This email is already registered for an account"
    );
  });
});
