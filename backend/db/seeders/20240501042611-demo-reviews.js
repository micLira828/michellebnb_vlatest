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
        userId: 1,
        spotId: 3,
        review: 'Beautiful place!',
        stars: 4.5
      },
      {
        userId: 1,
        spotId: 1,
        review: 'Cozy, but could not figure out coffee machine and wifi',
        stars: 3.5
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Great location, cozy room, great, amnenities, and polite staff. Overall great experience!',
        stars: 5.0
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
      review: { [Op.in]: ['Beautiful place!', 'Cozy, but could not figure out coffee machine and wifi', 'Great location, cozy room, great, amnenities, and polite staff. Overall great experience!'] }
    }, {});
  
 
  }
};
