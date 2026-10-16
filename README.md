# Proyecto de gestor personal de financias

Aplicación web para registrar y gestionar finanzas personales: ingresos, gastos y ahorros mensuales. Permite crear una cuenta para guardar la información de forma privada.

## Tecnologías usadas

- **Node.js v20.x**
<<<<<<< Updated upstream
- **Express.js**
- **PostgreSQL / MySQL (definir cuál usan)**
- **ORM si corresponde (Sequelize, Prisma, etc.)**
=======
- **PostgreSQL / MySQL (definir cuál usamos)**
>>>>>>> Stashed changes
- **Librería de autenticación (JWT, bcrypt, Passport, etc.)**

## Requisitos previos

- Node.js >= 20.x 
- npm >= 10.x
- PostgreSQL >= 15 o MySQL >= 8 corriendo localmente (o Docker si lo usan)
- Git

## Instalación

1. Clonar el repositorio:

git clone https://github.com/gmarigioli-prog/Gestion-de-gastos-Metodologia-de-sistemas-II.git
cd nombre-repo


2. Instalar las dependencias:

npm install


3. Copiar el archivo de variables de entorno de ejemplo:

cp .env.example .env


4. Completar el archivo .env con los valores correspondientes (ver sección de Configuración).

5. Crear la base de datos y correr las migraciones, si usan alguna:

npm run migrate


## Configuración

Variables de entorno necesarias (ver .env.example):

| Variable      | Descripción                        | Ejemplo                    |
|---------------|-------------------------------------|-----------------------------|
| DB_HOST       | Host de la base de datos            | localhost                    |
| DB_PORT       | Puerto de la base de datos          | 5432                         |
| DB_NAME       | Nombre de la base de datos          | finanzapp_db                 |
| DB_USER       | Usuario de la base de datos         | postgres                     |
| DB_PASSWORD   | Contraseña de la base de datos      | ****                     |
| JWT_SECRET    | Clave secreta para tokens de sesión | una_clave_larga_y_segura      |
| PORT          | Puerto donde corre el servidor      | 3000                         |

## Cómo correr el proyecto

Modo desarrollo:

npm run dev


Modo producción:

npm start


El servidor queda disponible en http://localhost:3000.

## Estructura del proyecto


├── src/
│   ├── controllers/      # Lógica de ingresos, gastos, ahorros, auth
│   ├── models/            # Modelos de la base de datos
│   ├── routes/            # Endpoints de la API
│   ├── middlewares/        # Autenticación, validaciones
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md


## Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Registro de ingresos mensuales
- Registro de gastos mensuales
- Registro de ahorros
- Categorías de gastos e ingresos
- Reportes financieros periódicos

## Integrantes del proyecto

- Painenahuel Luna Ignacio
- Zanconi Gianluca
- Marigioli Gino
- Federico Luengo

## Estado del proyecto

En desarrollo. 
Taller I, Metodología de Sistemas II, 2026.
---
---
