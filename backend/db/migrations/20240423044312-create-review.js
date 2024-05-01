'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: 
        { model: 'Users',
          key: 'id'
      },
       onDelete: 'CASCADE' // plural form }
      },
      spotId: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Spots',
          key: 'id'
        },
        onDelete: 'CASCADE' // plural form }
      },
      review: {
        type: Sequelize.TEXT
      },
      stars: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
    
  }
};