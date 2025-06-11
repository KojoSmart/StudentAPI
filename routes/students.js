const { Router } = require("express");
const router = Router();
const { v4: uuid4 } = require("uuid");
const { registerUserValidator } = require("../validator/student");
const { readData, writeData } = require("../utils/fileHandler");

router.get("/students", async (req, res) => {
  try {
    const students = await readData("students.json");
    res.json(students);
  } catch (error) {
    console.log(error);
  }
});
router.get("/students/:id", async (req, res) => {
  const students = await readData("students.json");
  const id = req.params.id;

  const student = students.find((student) => student.id === id);
  if (!student) {
    return res.status(404).json({
      error: "Student not found",
    });
  }
  return res.json({
    message: "Student found",
    student});
});

router.post("/students", async (req, res) => {
  const{name, age, gender, className} = req.body;
  const { error, value } = registerUserValidator.validate(req.body);
  if (error) {
    return res.status(422).json({error: error.details[0].message});
  }

  const students = await readData("students.json");
  let id = uuid4();
  let newStudents = {
    id,
    name: value.name,
    age: value.age,
    gender: value.gender,
    className: value.className,
  };
  students.push(newStudents);
  await writeData("students.json", students);

  res.status(200).json({
    message: "Student added successfully.",
    newStudents,
  });
});
router.put("/students/:id", async (req, res) => {
   const id = req.params.id;
  let students = await readData("students.json");
  const { name, gender, age,className} = req.body;
  const index = students.findIndex((student)=> student.id === id);
  if (index === -1){
    return res.status(404).json({error:"student not found"})
  }
  students[index]= {
    id: students[index].id,
    name: !name ? students[index].name : name,
    age: age !== undefined ? age: age[index].age,
    gender: gender !== undefined ? gender: gender[index].gender,
    className: className !== undefined ? className: className[index].className
  }
  await writeData("students.json", students) 
  res.status(200)
  .json({message:"student updated successfully",
  students})

});

router.delete("/students/:id", async (req, res) => {
  const id = req.params.id;
  const students = await readData("students.json");

  const findStudent = students.find((student) => student.id === id);
  console.log(findStudent);

  if (!findStudent) {
    return res.status(404).json({ error: "Student not found." });
  }

  const newStudent = students.filter((Student) => Student.id !== id);

  await writeData("students.json", newStudent);
  res
    .status(200)
    .json({ message: "Students deleted successfully.", findStudent });
});

module.exports = router;
