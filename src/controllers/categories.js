const db = require("../db");

async function create(input) {
  const [category] = await db
    .from("categories")
    .insert(input)
    .returning("*");

  return category ? category : null;
}

module.exports = {
  create
};
