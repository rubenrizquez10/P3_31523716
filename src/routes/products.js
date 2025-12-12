const express = require('express');
const router = express.Router();
const { authenticateToken: protect } = require('../middleware/auth');
const {
  createProduct,
  getAdminProduct,
  updateProduct,
  deleteProduct,
  getPublicProduct,
  getPublicProducts,
} = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   - name: Public - Products
 *     description: Public access to products
 *   - name: Admin - Products
 *     description: Product management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - publisher
 *         - sku
 *         - categoryId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the comic
 *         name:
 *           type: string
 *           description: The name of the comic
 *         slug:
 *           type: string
 *           description: The auto-generated slug of the comic
 *         description:
 *           type: string
 *           description: The description of the comic
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the comic
 *         stock:
 *           type: integer
 *           description: The stock of the comic
 *         publisher:
 *           type: string
 *           description: The publisher of the comic
 *         sku:
 *           type: string
 *           description: The SKU of the comic
 *         series:
 *           type: string
 *           description: The series of the comic
 *         issue_number:
 *           type: string
 *           description: The issue number of the comic
 *         publication_date:
 *           type: string
 *           format: date
 *           description: The publication date of the comic
 *         categoryId:
 *           type: integer
 *           description: The id of the category
 *         tagIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: The ids of the tags
 *       example:
 *         id: 1
 *         name: "The Amazing Spider-Man #1"
 *         slug: "the-amazing-spider-man-1"
 *         description: "The first issue of The Amazing Spider-Man."
 *         price: 3.99
 *         stock: 100
 *         publisher: "Marvel"
 *         sku: "MAR-ASM-1"
 *         series: "The Amazing Spider-Man"
 *         issue_number: "1"
 *         publication_date: "1963-03-10"
 *         categoryId: 1
 *         tagIds: [1, 2]
 */

// Rutas Públicas

/**
 * @swagger
 * /products/p/{id}-{slug}:
 *   get:
 *     summary: Get a public comic by id and slug with self-healing URL
 *     tags: [Public - Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The comic id
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The comic slug
 *     responses:
 *       200:
 *         description: The comic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       301:
 *         description: Redirect to the correct URL if the slug is wrong
 */
router.get('/p/:idSlug', getPublicProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a list of public comics with advanced filtering
 *     tags: [Public - Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: The category id
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: A comma-separated list of tag ids
 *       - in: query
 *         name: price_min
 *         schema:
 *           type: number
 *         description: The minimum price
 *       - in: query
 *         name: price_max
 *         schema:
 *           type: number
 *         description: The maximum price
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: A search term for name or description
 *       - in: query
 *         name: publisher
 *         schema:
 *           type: string
 *         description: The publisher of the comic
 *       - in: query
 *         name: series
 *         schema:
 *           type: string
 *         description: The series of the comic
 *     responses:
 *       200:
 *         description: A list of comics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/', getPublicProducts);

// Rutas de Gestión (Protegidas)

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new comic
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The comic was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post('/', protect, createProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single comic for admin view
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The comic id
 *     responses:
 *       200:
 *         description: The comic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get('/:id', protect, getAdminProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a comic
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The comic id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The comic was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.put('/:id', protect, updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a comic
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The comic id
 *     responses:
 *       204:
 *         description: The comic was deleted
 */
router.delete('/:id', protect, deleteProduct);

module.exports = router;
