'use strict';
const {SpotImage} = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await SpotImage.bulkCreate([
        {
            url: 'https://images.squarespace-cdn.com/content/v1/63dde481bbabc6724d988548/58407334-aa69-4240-bbf5-1b804b9f0a45/_4653760b-2f55-487b-8828-5879df5f32b2.jpeg',
            spotId: 1,
            preview: true
        },
        {
            url: 'https://hips.hearstapps.com/hmg-prod/images/barfield-house-tour-gramercy-park-bedroom-jpg-1618419012.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*',
            spotId: 1,
            preview: true
        },
        {
            url: 'https://media.houseandgarden.co.uk/photos/6410983736539c3c1f21fdc2/master/w_1600%2Cc_limit/Massey_HG_MtHarry2_138-production_digital.jpg',
            spotId: 1,
            preview: true
        },
        {
            url: 'https://i.pinimg.com/736x/3d/f8/3b/3df83b080872956257c87077444cdc06.jpg',
            spotId: 1,
            preview: true
        },
        {
            url: 'https://images.squarespace-cdn.com/content/v1/63dde481bbabc6724d988548/58407334-aa69-4240-bbf5-1b804b9f0a45/_4653760b-2f55-487b-8828-5879df5f32b2.jpeg',
            spotId: 2,
            preview: true
        },
        {
            url: 'https://hips.hearstapps.com/hmg-prod/images/barfield-house-tour-gramercy-park-bedroom-jpg-1618419012.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*',
            spotId: 2,
            preview: true
        },
        {
            url: 'https://media.houseandgarden.co.uk/photos/6410983736539c3c1f21fdc2/master/w_1600%2Cc_limit/Massey_HG_MtHarry2_138-production_digital.jpg',
            spotId: 2,
            preview: true
        },
        {
            url: 'https://i.pinimg.com/736x/3d/f8/3b/3df83b080872956257c87077444cdc06.jpg',
            spotId: 2,
            preview: true
        },
        {
            url: 'https://www.southernliving.com/thmb/R50HDhYdsNA9mQKzE9zFenYcA4M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2270901_cainc0259_1-2000-36b6699219454ee298de1d4565f1ab7d.jpg',
            spotId: 2,
            preview: true
        },
        {
            url: 'https://images.squarespace-cdn.com/content/v1/63dde481bbabc6724d988548/58407334-aa69-4240-bbf5-1b804b9f0a45/_4653760b-2f55-487b-8828-5879df5f32b2.jpeg',
            spotId: 3,
            preview: true
        },
        {
            url: 'https://hips.hearstapps.com/hmg-prod/images/barfield-house-tour-gramercy-park-bedroom-jpg-1618419012.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*',
            spotId: 3,
            preview: true
        },
        {
            url: 'https://media.houseandgarden.co.uk/photos/6410983736539c3c1f21fdc2/master/w_1600%2Cc_limit/Massey_HG_MtHarry2_138-production_digital.jpg',
            spotId: 1,
            preview: true
        },
        {
            url: 'https://i.pinimg.com/736x/3d/f8/3b/3df83b080872956257c87077444cdc06.jpg',
            spotId: 3,
            preview: true
        },
        {
            url: 'https://www.southernliving.com/thmb/R50HDhYdsNA9mQKzE9zFenYcA4M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2270901_cainc0259_1-2000-36b6699219454ee298de1d4565f1ab7d.jpg',
            spotId: 3,
            preview: true
        },
        {
            url: 'https://hips.hearstapps.com/hmg-prod/images/barfield-house-tour-gramercy-park-bedroom-jpg-1618419012.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*',
            spotId: 3,
            preview: true
        },
    ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * 
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     
    }, {});
 
  }
};
