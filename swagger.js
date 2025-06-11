const swaggerAutogen = require('swagger-autogen')

const doc = {
    info:{
        title: 'Student Management API',

        description: "Description"
    },
    host: 'https://studentapi-vce7.onrender.com'
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

swaggerAutogen (outputFile, routes, doc)