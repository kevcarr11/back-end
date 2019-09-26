const db = require("../db");

async function visit(user_id, restaurant_id) {
  const [visit] = await db
    .from("passport")
    .insert({ user_id, restaurant_id })
    .returning("*");

  return visit ? true : false;
}

async function removeVisit(user_id, restaurant_id) {
  const count = await db
    .from("passport")
    .where({ user_id, restaurant_id })
    .del();

  return count === 1;
}

async function getAllVisitsForUser(user_id) {
  const visits = await db
    .from("passport as p")
    .innerJoin("restaurants as r", "r.id", "p.restaurant_id")
    .innerJoin("cities as c", "c.id", "r.city")
    .innerJoin("categories as cat", "cat.id", "r.category")
    .select(
      "r.name",
      "r.phone",
      "r.address",
      "r.week",
      "r.weekend",
      "cat.name as category",
      "c.name as city",
      "cat.image as image"
    )
    .where({ user_id });

  return visits;
}

module.exports = {
  visit,
  removeVisit,
  getAllVisitsForUser
};
