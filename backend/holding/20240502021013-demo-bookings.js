'use strict';


const {Booking} = require('../db/models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
     
    await Booking.bulkCreate([{
      spotId: 1,
      userId: 1,
      startDate: '2024-11-11',
      endDate: '2024-11-12'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2024-3-11',
        endDate: '2024-3-12'
        },
        {
          spotId: 1,
          userId: 1,
          startDate:'2024-4-06',
          endDate: '2024-4-08'
          }
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {

    }, {});
  
   
  }
};
