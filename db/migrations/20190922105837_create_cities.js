
exports.up = function(knex) {
  return knex.schema.createTable('cities', cities => {
    cities.increments();
    cities.string('name');
  })  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('cities');  
};
