'use strict';
const {Spot} = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await Spot.bulkCreate([{
      latitide: 5.0,
      longitude: 10.0,
      ownerId: 1,
      address: '9707 Red Oak Avenue',
      name: 'Nessies Retreat',
      country: 'USA',
      city: 'Albany',
      state: 'California',
      description: 'A cozy retreat a short driving distance away from the golden gate bridge',
      price: 55.00
     },
     {
      latitide: 16.0,
      longitude: 11.0,
      ownerId: 1,
      address: '4670 Agee Street',
      name: 'The Road Less Traveled',
      country: 'USA',
      city: 'San Diego',
      state: 'California',
      description: 'A peaceful getaway, a short driving and bus distance from multiple eateries, beaches, malls, parks, shops, and more!',
      price: 68.00
     },
     {
      latitide: 2.0,
      longitude: 11.0,
      ownerId: 1,
      address: '5090 West Colton Avenue',
      name: 'Collegetown Deluxe',
      country: 'USA',
      city: 'Redlands',
      state: 'California',
      description: 'A charming little hideout a short walking distance from a gorgeous university, a small chique downtown with delicious coffee'
      ,price: 109.00
    }
    ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * 
     */
   
  }
};
