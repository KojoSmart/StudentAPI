const swaggerAutogen = require('swagger-autogen')

const doc = {
    info:{
        title: 'Student Management API',

        description: "Description"
    },
    host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

swaggerAutogen (outputFile, routes, doc)