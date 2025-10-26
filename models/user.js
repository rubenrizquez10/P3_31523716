'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       required:
   *         - fullName
   *         - email
   *         - password
   *       properties:
   *         id:
   *           type: integer
   *           description: El ID auto-generado del usuario
   *         fullName:
   *           type: string
   *           description: Nombre completo del usuario
   *         email:
   *           type: string
   *           format: email
   *           description: Correo electrónico único del usuario
   *         password:
   *           type: string
   *           format: password
   *           description: Contraseña del usuario (hash)
   *       example:
   *         id: 1
   *         fullName: John Doe
   *         email: john.doe@example.com
   */
  class User extends Model {
    /**
     * Método de ayuda para definir asociaciones.
     * Este método no forma parte del ciclo de vida de Sequelize.
     * El archivo `models/index` llamará a este método automáticamente.
     */
    static associate(models) {
      // definir asociación aquí
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
