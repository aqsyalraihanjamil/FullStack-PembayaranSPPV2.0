'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class spp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.siswa, {
        foreignKey: "id_spp",
        as: "spp"
      })
    }
  };
  spp.init({
    id_spp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    }, 
    tahun: DataTypes.INTEGER,
    nominal: DataTypes.INTEGER,
    angkatan: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'spp',
    tableName: 'spp'
  });
  return spp;
};