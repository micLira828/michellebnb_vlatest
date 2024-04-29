'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     
      Spot.hasMany(models.SpotImage, {foreignKey: "spotId" });
      Spot.hasMany(models.Booking, { foreignKey: "spotId" });
      Spot.hasMany(models.Review, { foreignKey: "spotId" });
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    ownerId: DataTypes.INTEGER,
    address: DataTypes.TEXT,
    name: DataTypes.TEXT,
    country: DataTypes.TEXT,
    city: DataTypes.TEXT,
    state: DataTypes.TEXT,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};