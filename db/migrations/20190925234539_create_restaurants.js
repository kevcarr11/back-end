exports.up = function(knex) {
  return knex.schema.createTable("restaurants", tbl => {
    tbl.increments();

    tbl.string("name").notNullable();

    tbl.string("phone").notNullable();
    tbl.string("address").notNullable();
    tbl.string("week").notNullable();
    tbl.string("weekend").notNullable();

    tbl
      .integer("city")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("cities")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    tbl
      .integer("category")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("categories")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("restaurants");
};
