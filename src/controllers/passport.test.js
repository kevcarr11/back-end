const Passport = require("./passport");
const bcrypt = require("bcryptjs");
const db = require("../db");

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

// const createLogin = login => ({
//   email: defaultUser.email,
//   password: "abadpassword",
//   ...login
// });

// const defaultLogin = createLogin();

beforeEach(async () => {
  await db.raw('TRUNCATE "passport" RESTART IDENTITY CASCADE;');
  await db.raw('TRUNCATE "users" RESTART IDENTITY CASCADE;');
  await db.raw('TRUNCATE "restaurants" RESTART IDENTITY CASCADE;');

  await db.from("cities").insert({ name: "Austin" });
  await db.from("cities").insert({ name: "Memphis" });
  await db.from("categories").insert({ name: "Tex-Mex", image: "yay" });

  await db.from("restaurants").insert(defaultRest);
  await db.from("restaurants").insert(createRest({ city: 2 }));

  await db.from("users").insert(defaultUser);
});

describe("passport", () => {
  it("should allow user to visit", async () => {
    const visited = await Passport.visit(1, 1);

    const visits = await db
      .from("passport")
      .select("*")
      .where({ user_id: 1 });

    expect(visited).toBe(true);
    expect(visits.length).toBe(1);
  });

  it("should allow a user to remove the visit", async () => {
    await db.from("passport").insert({ user_id: 1, restaurant_id: 1 });

    const didDelete = await Passport.removeVisit(1, 1);

    const visits = await db
      .from("passport")
      .select("*")
      .where({ user_id: 1 });

    expect(didDelete).toBe(true);
    expect(visits.length).toBe(0);
  });

  it("should get all visits for a user", async () => {
    await db.from("restaurants").insert(createRest({ name: "blah" }));
    await db.from("passport").insert({ user_id: 1, restaurant_id: 1 });
    await db.from("passport").insert({ user_id: 1, restaurant_id: 2 });

    const allVisits = await Passport.getAllVisitsForUser(1);

    expect(allVisits.length).toBe(2);
  });
});
