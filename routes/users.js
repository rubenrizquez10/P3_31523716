const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authenticateToken = require('../middleware/auth');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios (protegido)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado (token no proporcionado)
 *       403:
 *         description: Prohibido (token inválido)
 *   post:
 *     summary: Crea un nuevo usuario (protegido)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegister'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID (protegido)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 *   put:
 *     summary: Actualiza un usuario por ID (protegido)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegister' # Reutilizamos el esquema, aunque password no es estrictamente requerido
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 *   delete:
 *     summary: Elimina un usuario por ID (protegido)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 */

// OBTENER todos los usuarios (protegido)
router.get('/', authenticateToken, async (req, res) => { // Translated comment
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      data: error.message
    });
  }
});

// OBTENER usuario por ID (protegido)
router.get('/:id', authenticateToken, async (req, res) => { // Translated comment
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        data: 'Usuario no encontrado' // Translated
      });
    }
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      data: error.message
    });
  }
});

// CREAR nuevo usuario (protegido - aunque el registro es público, esto es para creación tipo admin)
router.post('/', authenticateToken, async (req, res) => { // Translated comment
  try {
    const { fullName, email, password } = req.body;
    // En una aplicación real, también se hashearía la contraseña aquí si se crea a través de un administrador
    const user = await User.create({ fullName, email, password });
    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      data: error.message
    });
  }
});

// ACTUALIZAR usuario por ID (protegido)
router.put('/:id', authenticateToken, async (req, res) => { // Translated comment
  try {
    const { fullName, email, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        data: 'Usuario no encontrado' // Translated
      });
    }
    // Hashear contraseña si se está actualizando
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    await user.save();
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      data: error.message
    });
  }
});

// ELIMINAR usuario por ID (protegido)
router.delete('/:id', authenticateToken, async (req, res) => { // Translated comment
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        data: 'Usuario no encontrado' // Translated
      });
    }
    await user.destroy();
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      data: error.message
    });
  }
});

module.exports = router;
