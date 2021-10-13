const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tabla extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tabla.init(
    {
      Sor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
     Username: DataTypes.STRING,
     Titkos: DataTypes.STRING
    },
    {
      // options
      sequelize,
      modelName: 'Tabla',
      tableName: 'tabla',
      timestamps: false,
      underscore: true,
    },
  );
  return Tabla;
};