exports.up = function(knex) {
  return knex.schema.createTable("passport", tbl => {
    tbl
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    tbl
      .integer("restaurant_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable('restaurants')
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("passport");
};
