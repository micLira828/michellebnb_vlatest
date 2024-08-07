'use strict';

let options = {};
const {Review} = require('../models');
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await Review.bulkCreate([{
        userId: 2,
        spotId: 3,
        review: 'Beautiful place!',
        stars: 4
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Cozy, but could not figure out coffee machine and wifi',
        stars: 3
      },
      {
        userId: 2,
        spotId: 3,
        review: 'Great location, cozy room, great, amnenities, and polite staff. Overall great experience!',
        stars: 5
      },
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
  
    }, {});
  
 
  }
};
