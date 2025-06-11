const swaggerAutogen = require('swagger-autogen')

const doc = {
    info:{
        title: 'Student Management API',

        description: "Description"
    },
    host: 'studentapi-vce7.onrender.com',
    schemes: ['https']
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

swaggerAutogen (outputFile, routes, doc)