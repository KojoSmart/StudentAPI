const fs = require("fs/promises");
const path = require("path");

const ST_FILE = path.join(__dirname, "../data/students.json");
const TE_FILE = path.join(__dirname, "../data/teachers.json");

const getFileName = (file) => {
  return path.join(__dirname, "../data", file);
};

console.log(getFileName("students.json"));

// read student data
async function readData(file) {
  const filePath = getFileName(file);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    if (!data.trim()) return[];
    return JSON.parse(data);
  } catch (error) {
    if(error.code === "ENOENT") return[];
    throw error
  }
}

async function writeData(file,data){
    const filePath = getFileName(file);
    try {
       const newData= await fs.writeFile(filePath,JSON.stringify(data,null,2));
       return newData;
    } catch (error) {
        throw error;
    }
}

module.exports = {
  readData,
  writeData
};
