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
     //Team.hasMany(models.Player, { as: 'TeamRoster', foreignKey: "currentTeamId" });
      Spot.hasMany(models.SpotImage, {foreignKey: "spotId" });
      Spot.hasMany(models.Booking, { foreignKey: "spotId" });
      Spot.hasMany(models.Review, { foreignKey: "spotId" });
      Spot.belongsTo(models.User, {as: 'Owner', foreignKey: "ownerId" });
    }
  }
  Spot.init({
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
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