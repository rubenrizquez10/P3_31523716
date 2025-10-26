var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Ejemplo', // Translated
      description: 'API de ejemplo para la P3', // Translated
      contact: {
        name: 'rubens rizquez'
      },
      servers: ['http://localhost:3001'] // Changed to 3001 for consistency with previous troubleshooting
    }
  },
  apis: ['./app.js', './routes/*.js', './models/*.js']
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * @swagger
 * /about:
 *   get:
 *     description: Devuelve información sobre el autor
 *     responses:
 *       200:
 *         description: Éxito
 */
app.get('/about', function(req, res, next) {
  res.json({
    status: 'success',
    data: {
      nombreCompleto: 'rubens rizquez',
      cedula: '31523716',
      seccion: '2'
    }
  });
});

/**
 * @swagger
 * /ping:
 *   get:
 *     description: Devuelve un estado 200 OK
 *     responses:
 *       200:
 *         description: Éxito
 */
app.get('/ping', function(req, res, next) {
  res.sendStatus(200);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

module.exports = app;
