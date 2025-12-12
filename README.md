# 🦸‍♂️ ComicStore API - Tienda de Cómics

Una API RESTful completa para una tienda de cómics con características avanzadas de seguridad, gestión de inventario, procesamiento de pagos y sistema de autenticación. Construida con Node.js, Express y SQLite.

## 🎯 Características Principales

### 🔐 Sistema de Autenticación Seguro
- Autenticación JWT (JSON Web Tokens) con middleware de protección
- Hash de contraseñas con bcryptjs y salt rounds
- Control de acceso basado en roles

### 📚 Gestión Completa de Cómics
- **Catálogo público** con filtros avanzados (categoría, precio, editorial, serie)
- **URLs amigables** con auto-healing (redirección automática si el slug cambia)
- **Sistema de tags** para clasificación avanzada
- **Categorización jerárquica** de productos

### 🛒 Sistema de Pedidos Avanzado
- **Transacciones atómicas** para procesamiento de pedidos
- **Verificación de stock** en tiempo real
- **Sistema de pagos integrado** (tarjeta de crédito)
- **Rollback automático** si falla cualquier paso del proceso
- **Historial completo** de pedidos por usuario

### 🛡️ Seguridad Integral
- Headers de seguridad con Helmet
- Validación completa de inputs
- Manejo seguro de errores (sin exposición de datos sensibles)
- CORS configurado
- Logging completo con Morgan

### 📖 Documentación Interactiva
- **Swagger/OpenAPI 3.0** completamente documentado
- Ejemplos de requests y responses
- Testing interactivo desde el navegador

### 🧪 Testing Exhaustivo
- Cobertura completa con Jest y Supertest
- Tests de integración y unitarios
- Tests de autenticación y autorización
- Tests de endpoints públicos y protegidos

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │   Services      │    │  Repositories   │
│                 │    │                 │    │                 │
│ • ProductCtrl   │◄──►│ • QueryBuilder  │◄──►│ • ProductRepo   │
│ • OrderCtrl     │    │ • PaymentStrat  │    │ • OrderRepo     │
│ • UserCtrl      │    │                 │    │                 │
│ • CategoryCtrl  │    │                 │    │                 │
│ • TagCtrl       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │   (SQLite)      │
                    │                 │
                    │ • Users         │
                    │ • Products      │
                    │ • Categories    │
                    │ • Tags          │
                    │ • Orders        │
                    │ • OrderItems    │
                    └─────────────────┘
```

## 🛠️ Stack Tecnológico

### Backend Core
- **Node.js** (v18+)
- **Express.js** - Framework web minimalista y flexible
- **SQLite** - Base de datos ligera y embebida

### ORM y Base de Datos
- **Sequelize** - ORM moderno para Node.js
- **sqlite3** - Driver nativo para SQLite

### Autenticación y Seguridad
- **jsonwebtoken** - Implementación de JWT
- **bcryptjs** - Hash de contraseñas
- **helmet** - Headers de seguridad HTTP
- **cors** - Configuración CORS

### Desarrollo y Testing
- **nodemon** - Recarga automática en desarrollo
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs HTTP

### Documentación
- **swagger-jsdoc** - Generación de documentación OpenAPI
- **swagger-ui-express** - UI interactiva para documentación

## 📋 Endpoints de la API

### 🔓 **Endpoints Públicos** (Sin autenticación)

#### Productos/Cómics
- `GET /products` - Listado de cómics con filtros avanzados
  - Parámetros: `page`, `limit`, `category`, `tags`, `price_min`, `price_max`, `search`, `publisher`, `series`
- `GET /p/:idSlug` - Producto individual con URL amigable (auto-healing)

#### Autenticación
- `POST /auth/register` - Registro de nuevo usuario
- `POST /auth/login` - Inicio de sesión

#### Salud del Sistema
- `GET /health` - Verificación de estado de la API

### 🔒 **Endpoints Protegidos** (Requieren JWT)

#### Gestión de Usuarios (Admin)
- `GET /users` - Listado de usuarios
- `GET /users/:id` - Usuario específico
- `POST /users` - Crear usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

#### Gestión de Categorías
- `GET /categories` - Listado de categorías
- `GET /categories/:id` - Categoría específica
- `POST /categories` - Crear categoría
- `PUT /categories/:id` - Actualizar categoría
- `DELETE /categories/:id` - Eliminar categoría

#### Gestión de Tags/Etiquetas
- `GET /tags` - Listado de tags
- `GET /tags/:id` - Tag específico
- `POST /tags` - Crear tag
- `PUT /tags/:id` - Actualizar tag
- `DELETE /tags/:id` - Eliminar tag

#### Gestión de Productos/Cómics
- `GET /products/:id` - Producto específico (vista admin)
- `POST /products` - Crear nuevo cómic
- `PUT /products/:id` - Actualizar cómic
- `DELETE /products/:id` - Eliminar cómic

#### Sistema de Pedidos
- `GET /orders` - Historial de pedidos del usuario
- `GET /orders/:id` - Detalles de pedido específico
- `POST /orders` - Crear nuevo pedido con procesamiento de pago

## 🎮 Ejemplos de Uso Avanzado

### Filtrado Avanzado de Cómics
```bash
# Buscar cómics de Marvel con precio entre 5 y 15 dólares
GET /products?publisher=Marvel&price_min=5&price_max=15&page=1&limit=20

# Buscar cómics de Batman con tags específicos
GET /products?search=Batman&tags=1,3,5&series=Batman

# Cómics de una categoría específica ordenados por precio
GET /products?category=2&limit=10&sort=price_asc
```

### Crear un Pedido Completo
```bash
POST /orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ],
  "paymentMethod": "CreditCard",
  "paymentDetails": {
    "cardToken": "tok_visa_123456789",
    "currency": "USD"
  }
}
```

### Gestión Completa de Productos
```bash
# Crear un nuevo cómic
POST /products
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "The Amazing Spider-Man #700",
  "description": "Edición especial del 700avo número",
  "price": 9.99,
  "stock": 50,
  "publisher": "Marvel",
  "sku": "MAR-ASM-700",
  "series": "The Amazing Spider-Man",
  "issue_number": "700",
  "publication_date": "2023-12-01",
  "categoryId": 1,
  "tagIds": [1, 2, 4]
}
```

## 📁 Estructura del Proyecto

```
api-security-project/
├── src/
│   ├── app.js                 # Punto de entrada principal
│   ├── config/
│   │   └── database.js        # Configuración de Sequelize
│   ├── controllers/           # Controladores de rutas
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── tagController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/            # Middleware personalizado
│   │   ├── auth.js            # Autenticación JWT
│   │   └── errorHandler.js    # Manejo de errores
│   ├── models/                # Modelos de Sequelize
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Tag.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── ProductTag.js
│   │   ├── associations.js    # Relaciones entre modelos
│   │   └── index.js           # Configuración de modelos
│   ├── repositories/          # Patrón Repository
│   │   ├── ProductRepository.js
│   │   └── OrderRepository.js
│   ├── routes/                # Definición de rutas
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── tags.js
│   │   └── orders.js
│   └── services/              # Lógica de negocio
│       ├── ProductQueryBuilder.js
│       └── payment/
│           ├── PaymentStrategy.js
│           └── CreditCardPaymentStrategy.js
├── tests/                     # Suite de pruebas
│   ├── auth.test.js
│   ├── users.test.js
│   ├── products.test.js
│   ├── orders.test.js
│   ├── integration.test.js
│   ├── global-setup.js
│   ├── global-teardown.js
│   └── test-setup.js
├── scripts/                   # Scripts de utilidad
│   ├── setup.js
│   └── test-setup.js
├── node_modules/              # Dependencias
├── .env                       # Variables de entorno
├── .env.example               # Template de variables
├── jest.config.js             # Configuración de Jest
├── nodemon.json               # Configuración de Nodemon
├── package.json               # Dependencias y scripts
├── README.md                  # Esta documentación
└── database.sqlite            # Base de datos SQLite
```

## 🗄️ Modelo de Datos Completo

### Diagrama de Relaciones
```
┌─────────────┐     ┌─────────────┐
│    Users    │     │   Orders    │
├─────────────┤     ├─────────────┤
│ id (PK)     │◄────┤ id (PK)     │
│ fullName    │     │ userId (FK) │
│ email       │     │ status      │
│ password    │     │ totalAmount │
│ createdAt   │     │ createdAt   │
│ updatedAt   │     └─────────────┘
└─────────────┘           │
                          │
                          ▼
                   ┌─────────────┐
                   │ OrderItems  │
                   ├─────────────┤
                   │ id (PK)     │
                   │ orderId (FK)│
                   │ productId   │
                   │ quantity    │
                   │ price       │
                   └─────────────┘
                          │
                          ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Products   │◄────┤ ProductTags │────►│    Tags     │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ productId   │     │ id (PK)     │
│ name        │     │ tagId       │     │ name        │
│ slug        │     └─────────────┘     └─────────────┘
│ description │             ▲
│ price       │             │
│ stock       │             │
│ publisher   │             │
│ sku         │             │
│ series      │             ▼
│ issue_number│     ┌─────────────┐
│ pub_date    │     │ Categories  │
│ categoryId  │────►├─────────────┤
│ createdAt   │     │ id (PK)     │
│ updatedAt   │     │ name        │
└─────────────┘     │ description │
                    └─────────────┘
```

### Tablas Principales

#### Products (Cómics)
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  publisher VARCHAR(255),
  sku VARCHAR(100) UNIQUE,
  series VARCHAR(255),
  issue_number VARCHAR(50),
  publication_date DATE,
  categoryId INTEGER,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);
```

#### Orders (Pedidos)
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  status ENUM('PENDING', 'COMPLETED', 'CANCELED', 'PAYMENT_FAILED') DEFAULT 'PENDING',
  totalAmount DECIMAL(10,2) NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

#### OrderItems (Items de Pedido)
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);
```

## 🔄 Flujos de Negocio

### Proceso de Compra
1. **Búsqueda y Filtrado**: Usuario navega catálogo público
2. **Autenticación**: Usuario inicia sesión o se registra
3. **Carrito**: Usuario selecciona productos
4. **Checkout**: Sistema valida stock disponible
5. **Pago**: Procesamiento de pago via API externa
6. **Confirmación**: Actualización de inventario y creación de orden
7. **Notificación**: Confirmación de pedido exitoso

### Gestión de Inventario
- **Verificación de Stock**: Antes de cada pedido
- **Actualización Atómica**: Stock se reduce solo si pago es exitoso
- **Prevención de Sobrevventa**: Transacciones bloquean stock temporalmente

### Sistema de URLs Amigables
- **Slug Generation**: Automático desde el nombre del cómic
- **Auto-healing**: Redirección automática si slug cambia
- **SEO Friendly**: URLs legibles para motores de búsqueda

## 🧪 Estrategias de Testing

### Cobertura de Tests
- **Unit Tests**: Funciones individuales y utilidades
- **Integration Tests**: Flujos completos de API
- **Authentication Tests**: Endpoints protegidos y públicos
- **Database Tests**: Operaciones CRUD y relaciones
- **Payment Tests**: Simulación de pagos (sin llamadas reales)

### Configuración de Testing
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/config/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.js'],
  globalSetup: '<rootDir>/tests/global-setup.js',
  globalTeardown: '<rootDir>/tests/global-teardown.js'
};
```

## 🚀 Despliegue y Escalabilidad

### Variables de Entorno Avanzadas
```env
# Base de datos
DB_PATH=./database.sqlite
DB_LOGGING=false

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=production

# Pagos (simulado)
PAYMENT_API_URL=https://api.payment-gateway.com
PAYMENT_API_KEY=your-payment-api-key

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### Estrategias de Despliegue
- **Contenedorización**: Dockerfile incluido
- **Orquestación**: Configuración Docker Compose
- **CDN**: Para archivos estáticos si se expanden
- **Base de Datos**: Migración a PostgreSQL/MySQL en producción
- **Cache**: Redis para sesiones y datos frecuentes
- **Monitoreo**: Logs centralizados y métricas

## 🔧 Scripts y Automatización

### Scripts de NPM
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "sequelize-cli db:migrate",
    "db:seed": "sequelize-cli db:seed:all",
    "lint": "eslint src/**/*.js",
    "format": "prettier --write src/**/*.js"
  }
}
```

### Automatización de Desarrollo
- **Pre-commit Hooks**: ESLint y tests automáticos
- **CI/CD Pipeline**: GitHub Actions con múltiples entornos
- **Database Seeding**: Datos de prueba automatizados
- **API Documentation**: Generación automática desde código

## 📊 Monitoreo y Métricas

### Health Checks
- Endpoint `/health` para verificación de estado
- Métricas de base de datos y conexiones
- Verificación de servicios externos

### Logging
- Logs estructurados con Winston
- Niveles de log configurables
- Rotación automática de archivos

## 🤝 Contribuciones y Desarrollo

### Guías de Desarrollo
1. **Fork** el repositorio
2. Crear rama **feature/nueva-funcionalidad**
3. **Commits** descriptivos siguiendo conventional commits
4. **Pull Request** con descripción detallada
5. **Code Review** y aprobación

### Estándares de Código
- **ESLint** para linting
- **Prettier** para formateo
- **Husky** para git hooks
- **Conventional Commits** para mensajes

## 📈 Roadmap y Mejoras Futuras

### Próximas Funcionalidades
- [ ] **Carrito de Compras Persistente**
- [ ] **Sistema de Reviews y Ratings**
- [ ] **API de Newsletter**
- [ ] **Sistema de Cupones de Descuento**
- [ ] **Integración con Redes Sociales**
- [ ] **App Móvil Complementaria**

### Mejoras Técnicas
- [ ] **GraphQL API** (además de REST)
- [ ] **WebSockets** para notificaciones en tiempo real
- [ ] **Microservicios** para escalabilidad
- [ ] **Cache Avanzado** con Redis
- [ ] **CDN Integration** para imágenes

## Comenzando

### Prerrequisitos
- Node.js (v18 o superior)
- npm

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd api-security-project
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo de entorno:
```bash
cp env.example .env
```

4. Actualizar variables de entorno en `.env`:
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=tu-clave-secreta-jwt-aqui
DB_PATH=./database.sqlite
```

### Ejecutando la Aplicación

#### Desarrollo
```bash
npm run dev
```

#### Producción
```bash
npm start
```

La API estará disponible en `http://localhost:3000`

### Documentación de API

Una vez que el servidor esté ejecutándose, visita `http://localhost:3000/api-docs` para acceder a la documentación interactiva de Swagger.

## Pruebas

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage
```

### Estructura de Pruebas
- `tests/auth.test.js` - Pruebas de endpoints de autenticación
- `tests/users.test.js` - Pruebas de endpoints de gestión de usuarios
- `tests/integration.test.js` - Pruebas de integración y flujos

## Características de Seguridad

- **Hash de Contraseñas**: Usa bcryptjs con salt rounds
- **Autenticación JWT**: Autenticación segura basada en tokens
- **Protección de Rutas**: Middleware para proteger endpoints sensibles
- **Validación de Entrada**: Validación integral de requests
- **Headers de Seguridad**: Middleware Helmet para headers de seguridad
- **Manejo de Errores**: Respuestas de error seguras sin exposición de datos sensibles

## Esquema de Base de Datos

### Tabla Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

## Formato de Respuesta de API

Todas las respuestas de API siguen el estándar JSend:

### Respuesta de Éxito
```json
{
  "status": "success",
  "message": "Operación completada exitosamente",
  "data": { ... }
}
```

### Respuesta de Error
```json
{
  "status": "fail",
  "message": "Descripción del error",
  "data": { ... }
}
```

## Autenticación

### Registrar Usuario
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "password": "password123"
  }'
```

### Iniciar Sesión
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "password123"
  }'
```

### Acceder a Rutas Protegidas
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

## Despliegue

### Despliegue en Render

1. Conectar tu repositorio de GitHub a Render
2. Configurar variables de entorno:
   - `NODE_ENV=production`
   - `JWT_SECRET=<tu-clave-secreta>`
   - `DB_PATH=./database.sqlite`
3. Desplegar automáticamente en push a la rama main

### Variables de Entorno

| Variable | Descripción | Por Defecto |
|----------|-------------|-------------|
| `NODE_ENV` | Modo de entorno | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `JWT_SECRET` | Clave secreta de firma JWT | Requerido |
| `DB_PATH` | Ruta del archivo de base de datos | `./database.sqlite` |

## Pipeline CI/CD

El proyecto incluye un workflow de GitHub Actions que:
- Ejecuta pruebas en Node.js 18.x y 20.x
- Realiza auditorías de seguridad
- Genera reportes de cobertura
- Despliega a Render en pushes a la rama main

## Contribuir

1. Hacer fork del repositorio
2. Crear una rama de feature: `git checkout -b feature-name`
3. Hacer commit de los cambios: `git commit -am 'Add feature'`
4. Hacer push a la rama: `git push origin feature-name`
5. Enviar un pull request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.

## 🔧 **Correcciones para Render (Producción)**

### Problemas Solucionados

#### 1. **Error CORS en Producción**
- **Problema**: Helmet interfería con CORS
- **Solución**: Comentado Helmet y configurado CORS explícitamente
```javascript
// En src/app.js
// app.use(helmet()); // ← Comentado
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

#### 2. **Error 500 en Render**
- **Problema**: SQLite con permisos y rutas inadecuadas
- **Solución**: Ruta de BD cambiada a `/tmp/database.sqlite`
```yaml
# En render.yaml
envVars:
  - key: DB_PATH
    value: /tmp/database.sqlite  # ← Cambiado de ./database.sqlite
```

#### 3. **Sección "Servidor" en Swagger**
- **Problema**: Aparecía información hardcoded de servidor
- **Solución**: Sección `servers` comentada
```javascript
// En src/app.js - Configuración Swagger
// servers: [ ... ] ← Comentado
```

### Variables de Entorno Requeridas en Render

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Modo producción |
| `JWT_SECRET` | Auto-generado | Secreto JWT (Render lo genera) |
| `DB_PATH` | `/tmp/database.sqlite` | Ruta BD para Render |

### Verificación de Funcionamiento

Después de aplicar estos cambios:

1. **Commit y push**:
```bash
git add .
git commit -m "Fix Render production issues: CORS, DB path, Swagger"
git push origin main
```

2. **Verificar en Render**:
   - Dashboard → Tu servicio → **Logs**
   - Probar endpoint: `https://tu-app.onrender.com/health`
   - Verificar documentación: `https://tu-app.onrender.com/api-docs`

3. **Probar CORS**:
```bash
curl -H "Origin: https://tu-frontend.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS https://tu-app.onrender.com/products
```

## Soporte

Para soporte y preguntas, por favor abre un issue en el repositorio de GitHub.
