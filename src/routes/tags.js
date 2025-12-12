const express = require('express');
const router = express.Router();
const { authenticateToken: protect } = require('../middleware/auth');
const {
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
} = require('../controllers/tagController');

/**
 * @swagger
 * tags:
 *   name: Admin - Tags
 *   description: Tag management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the tag
 *         name:
 *           type: string
 *           description: The name of the tag
 *       example:
 *         id: 1
 *         name: "New"
 */

// Todas las rutas aquí están protegidas
router.use(protect);

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Returns the list of all the tags
 *     tags: [Admin - Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 */
router.route('/').get(getTags);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Admin - Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       201:
 *         description: The tag was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 */
router.route('/').post(createTag);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Get the tag by id
 *     tags: [Admin - Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tag id
 *     responses:
 *       200:
 *         description: The tag description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 */
router.route('/:id').get(getTag);

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Update the tag by the id
 *     tags: [Admin - Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tag id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       200:
 *         description: The tag was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 */
router.route('/:id').put(updateTag);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Remove the tag by id
 *     tags: [Admin - Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tag id
 *     responses:
 *       204:
 *         description: The tag was deleted
 */
router.route('/:id').delete(deleteTag);

module.exports = router;
