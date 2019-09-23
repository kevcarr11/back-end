exports.up = function(knex) {
  return knex.schema.createTable("users", users => {
    users.increments();
    users.string("firstName").notNullable();
    users.string("lastName").notNullable();
    users
      .string("email")
      .unique()
      .notNullable();
    users.string("password").notNullable();
    users
      .integer("city")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("cities")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    // Other fields we might add
    // phoneNumber
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
