exports.seed = function(knex) {
  return knex.from('categories').insert([
    {
      name: 'Tex-Mex',
    },
    {
      name: 'Authentic Mexican',
    },
    {
      name: 'American',
    },
    {
      name: 'Fusion',
    },
    {
      name: 'Greek',
    },
    {
      name: 'Chinese',
    },
    {
      name: 'Thai',
    },
    {
      name: 'Italian',
    },
  ])
};
