
exports.up = function(knex) {
  return knex.schema.createTable('categories', categories => {
    categories.increments();

    categories.string('name').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('categories');  
};
