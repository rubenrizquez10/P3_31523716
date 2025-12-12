const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

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
 *           description: ID de usuario auto-generado
 *         fullName:
 *           type: string
 *           description: Nombre completo del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Dirección de correo electrónico del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario (mínimo 6 caracteres)
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               description: Token JWT
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@ejemplo.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El correo electrónico ya existe
 */
router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Validar campos requeridos
    if (!fullName || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Nombre completo, correo electrónico y contraseña son requeridos',
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 'fail',
        message: 'El correo electrónico ya está registrado',
      });
    }

    // Crear nuevo usuario
    const user = await User.create({
      fullName,
      email,
      password,
    });

    // Generar token JWT
    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@ejemplo.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Error de validación
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Correo electrónico y contraseña son requeridos',
      });
    }

    // Buscar usuario por correo electrónico
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Credenciales inválidas',
      });
    }

    // Validar contraseña
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'fail',
        message: 'Credenciales inválidas',
      });
    }

    // Generar token JWT
    const token = generateToken(user);

    res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
