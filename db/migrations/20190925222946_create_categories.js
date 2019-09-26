
exports.up = function(knex) {
  return knex.schema.createTable('categories', categories => {
    categories.increments();

    categories.string('name').notNullable();
    categories.string('image');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('categories');  
};
