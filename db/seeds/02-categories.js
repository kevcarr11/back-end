exports.seed = function(knex) {
  return knex.from('categories').insert([
    {
      name: 'Tex-Mex',
      image: 'https://irp-cdn.multiscreensite.com/d303ec29/dms3rep/multi/tablet/TT-Set3-071-69cea3aa-db59667a.jpg',
    },
    {
      name: 'Authentic Mexican',
      image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80',
    },
    {
      name: 'American',
      image: 'https://images.unsplash.com/photo-1501688190156-9e816757373a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
    },
    {
      name: 'Fusion',
      image: 'https://casasensei.com/wp-content/uploads/2019/06/iStock-1146800298-1-1024x518.jpg',
    },
    {
      name: 'Greek',
      image: 'https://travelpassionate.com/wp-content/uploads/2018/08/shutterstock_646209769-min.jpg',
    },
    {
      name: 'Chinese',
      image: 'https://images2.minutemediacdn.com/image/upload/c_crop,h_695,w_1237,x_0,y_58/f_auto,q_auto,w_1100/v1554992472/shape/mentalfloss/521724-istock-545286388.jpg'
    },
    {
      name: 'Thai',
      image: 'https://ca-times.brightspotcdn.com/dims4/default/2e34a33/2147483647/strip/true/crop/1024x682+0+0/resize/840x559!/quality/90/?url=https%3A%2F%2Fca-times.brightspotcdn.com%2Faf%2F50%2F7f81df573a8077319a05bb6bc01b%2Fla-1558567056-ewie79db4m-snap-image'
    },
    {
      name: 'Italian',
      image: 'https://travelfoodatlas.com/wp-content/uploads/2018/02/Italian-food.jpeg'
    },
  ])
};
