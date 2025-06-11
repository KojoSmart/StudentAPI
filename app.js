

const express = require("express");
const app = express();
const studentrouter = require("./routes/students");
// const { ST_FILE, TE_FILE } = require("./utils/fileHandler");
app.use(express.json());
app.use("/", studentrouter);

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
