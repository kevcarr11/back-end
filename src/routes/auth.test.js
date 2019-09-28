const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const server = require("../server");
const db = require("../db");
const salt = require("../salt");

beforeAll(async () => {
  await db.raw('TRUNCATE "users" RESTART IDENTITY CASCADE;');
  await db.raw('TRUNCATE "cities" RESTART IDENTITY CASCADE;');
});

afterEach(async () => {
  await db.raw('TRUNCATE "users" RESTART IDENTITY CASCADE;');
  await db.raw('TRUNCATE "cities" RESTART IDENTITY CASCADE;');
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

const createUser = user => ({
  firstName: "Matt",
  lastName: "Hagner",
  password: "abadpassword",
  email: "example@example.com",
  city: 1,
  ...user
});

const defaultUser = createUser();

beforeEach(async () => {
  await db.from("cities").insert({ name: "Austin" });

  await db
    .from("users")
    .insert(
      createUser({ password: bcrypt.hashSync(defaultUser.password, salt()) })
    );
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

  it("should return a status of 200 if successful", async done => {
    const res = await request(server)
      .post(ENDPOINT)
      .send(defaultLogin);

    expect(res.status).toBe(200);
    done();
  });

  it("should return a jwt with the user token", async done => {
    const res = await request(server)
      .post(ENDPOINT)
      .send(defaultLogin);

    const { token, user } = res.body;
    const decoded = jwt.decode(token);
    expect(decoded.sub).toBe(1);
    expect(user.firstName).toBe("Matt");
    expect(user.lastName).toBe("Hagner");
    done();
  });

  it("should validate user input", async done => {
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
    done();
  });

  it("should return a 401 when the user login info is incorrect", async done => {
    const res = await request(server)
      .post(ENDPOINT)
      .send(badLogin);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid login credentials");
    done();
  });
});

describe("POST api/auth/register", () => {
  it("should return a 201 on success", async done => {
    const res = await request(server)
      .post("/api/auth/register")
      .send(createUser({ email: "newemail@gmail.com" }));

    expect(res.status).toBe(201);
    done();
  });

  it("should insert the user into the database", async done => {
    await request(server)
      .post("/api/auth/register")
      .send(createUser({ email: "fred@gmail.com" }));

    const users = await db.select("*").from("users");
    const [, user] = users;

    expect(users.length).toBe(2);
    expect(user.firstName).toBe("Matt");
    expect(user.lastName).toBe("Hagner");
    expect(user.email).toBe("fred@gmail.com");
    done();
  });

  it("should return a jwt", async done => {
    const input = {
      email: "fred@gmail.com",
      firstName: "Fred",
      lastName: "Durst"
    };

    const userInput = createUser(input);

    const res = await request(server)
      .post("/api/auth/register")
      .send(userInput);

    const { token, user } = res.body;

    // We aren't concerned with whether or not the token is valid,
    // but instead just that it contains the information we expect
    // for this test, which is that the sub is equal to the user id
    // that we expect.
    const decoded = jwt.decode(token);

    expect(decoded.sub).toBe(2);
    expect(user.firstName).toBe(userInput.firstName);
    expect(user.lastName).toBe(userInput.lastName);
    done();
  });

  it("it should validate the user input", async done => {
    const res = await request(server)
      .post("/api/auth/register")
      .send(createUser({ password: null }));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("password must be at least 8 characters");
    done();
  });

  it("should return a 400 if the username is already taken", async done => {
    const res = await request(server)
      .post("/api/auth/register")
      .send(defaultUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "This email is already registered for an account"
    );

    done();
  });
});
