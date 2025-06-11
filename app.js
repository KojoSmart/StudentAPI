

const express = require("express");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json')
const studentrouter = require("./routes/students");

//Middleware
app.use(express.json());


// use student route
app.use("/", studentrouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
