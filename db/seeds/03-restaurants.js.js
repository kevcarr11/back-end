const faker = require("faker");

let restaurants = [];

for (let i = 0; i < 20; i++) {
  restaurants.push({
    name: faker.company.companyName(),
    phone: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(true),
    week: "8:00am - 10:00pm",
    weekend: "7:00am - 8:00pm",
    city: 1,
    category: Math.ceil(Math.random() * 8)
  });
}

exports.seed = function(knex) {
  return knex.from("restaurants").insert(restaurants);
};
