const db = require("../db");

async function create(user) {
  const [insertedUser] = await db
    .from("users")
    .insert(user)
    .returning("*");

  return insertedUser;
}

async function getByEmail(email) {
  const [user] = await db
    .select("*")
    .from("users")
    .where({ email });

  return user ? user : null;
}

module.exports = {
  create,
  getByEmail
};
