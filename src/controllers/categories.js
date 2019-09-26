const db = require("../db");

async function create(input) {
  const [category] = await db
    .from("categories")
    .insert(input)
    .returning("*");

  return category ? category : null;
}

function getAll() {
  return db.from("categories").select("*");
}

async function getByField(fieldName, value) {
  const [category] = await db
    .from("categories")
    .select("*")
    .where({ [fieldName]: value });

  return category ? category : null;
}

function getById(id) {
  return getByField("id", id);
}

function getByName(name) {
  return getByField("name", name);
}

async function updateById(id, update) {
  const [category] = await db
    .from("categories")
    .update(update)
    .where({ id })
    .returning("*");

  return category ? category : null;
}

async function deleteById(id) {
  const count = await db
    .from("categories")
    .del()
    .where({ id });

  return count === 1;
}

module.exports = {
  create,
  getAll,
  getById,
  getByName,
  updateById,
  deleteById
};
