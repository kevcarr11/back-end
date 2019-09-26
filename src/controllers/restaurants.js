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
    .from("restaurants")
    .select("*")
    .where({ [name]: val });

  return rest ? rest : null;
};

const getById = getByField("id");
const getByName = getByField("name");

const getAll = async () => {
  const restaurants = await db.from("restaurants").select("*");

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
