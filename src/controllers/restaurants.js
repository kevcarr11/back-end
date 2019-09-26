const db = require("../db");

async function create(input) {
  const [rest] = await db
    .from("restaurants")
    .insert(input)
    .returning("*");

  return rest ? rest : null;
}

const getByField = name => async val => {
  const [rest] = await db
    .from("restaurants as r")
    .innerJoin("categories as cat", "cat.id", "r.category")
    .innerJoin("cities as c", "c.id", "r.city")
    .select(
      "r.name",
      "r.id",
      "phone",
      "address",
      "week",
      "weekend",
      "cat.name as category",
      "c.name as city",
      "cat.image as image"
    )
    .where({ [`r.${name}`]: val });

  return rest ? rest : null;
};

const getById = getByField("id");
const getByName = getByField("name");

const getAll = async () => {
  const restaurants = await db
    .from("restaurants as r")
    .innerJoin("categories as cat", "cat.id", "r.category")
    .innerJoin("cities as c", "c.id", "r.city")
    .select(
      "r.name",
      "r.id",
      "phone",
      "address",
      "week",
      "weekend",
      "cat.name as category",
      "c.name as city",
      "cat.image as image"
    );
  return restaurants;
};

async function deleteById(id) {
  const deleteCount = await db
    .from("restaurants")
    .del()
    .where({ id });

  return deleteCount === 1;
}

async function updateById(id, update) {
  const [restaurant] = await db
    .from("restaurants")
    .update(update)
    .where({ id })
    .returning("*");

  return restaurant ? restaurant : null;
}

module.exports = {
  create,
  getById,
  getByName,
  getAll,
  deleteById,
  updateById
};
