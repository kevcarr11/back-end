exports.seed = function(knex) {
  return knex.from('cities').insert([
    {
      name: 'Austin',
    }
  ]);
};
