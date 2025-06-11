const { Router } = require("express");
const router = Router();
const { v4: uuid4 } = require("uuid");
// const  registerUserValidator  = require("../middleware/validator");
const { registerUserValidator } = require("../middleware/validator");

const { readData, writeData } = require("../utils/fileHandler");
// const errorHandler = require("../middleware/errorhandler"); // <-- import it


// router.get("/students", async (req, res) => {
//   try {
//     const students = await readData("students.json");
//     res.json(students);
//   } catch (error) {
//     console.log(error);
//   }
// });


router.get("/students", async (req, res, next) => {
  try {
    const students = await readData("students.json");
    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
      error: null,
    });
  } catch (error) {
    next(error); // pass error to middleware
  }
});

router.get("/students/:id", async (req, res, next) => {
  try {
    const id = req.params.id; // Get the student ID from the URL

    const students = await readData("students.json"); // Read all students

    const student = students.find((student) => student.id === id); // Find student with matching ID

    if (!student) {
      // If not found, send a 404 response
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
        error: null,
      });
    }

    // If found, send the student back
    return res.status(200).json({
      success: true,
      message: "Student found",
      data: student,
      error: null,
    });

  } catch (err) {
    // If an unexpected error happens, pass it to the error handler
    next(err);
  }
});

// router.get("/students/:id", async (req, res) => {
//   const students = await readData("students.json");
//   const id = req.params.id;

//   const student = students.find((student) => student.id === id);
//   if (!student) {
//     return res.status(404).json({
//       error: "Student not found",
//     });
//   }
//   return res.json({
//     message: "Student found",
//     student});
// });

// router.get("/students/search", async (req, res) => {
//   const { name } = req.query;
//     if (!name) {
//     return res.status(400).json({ error: "Name query parameter is required" });
//   }
// }
// )

// router.post("/students", async (req, res) => {
//   const{name, age, gender, className} = req.body;
//   const { error, value } = registerUserValidator.validate(req.body);
//   if (error) {
//     return res.status(422).json({error: error.details[0].message});
//   }

//   const students = await readData("students.json");
//   let id = uuid4();
//   let newStudents = {
//     id,
//     name: value.name,
//     age: value.age,
//     gender: value.gender,
//     className: value.className,
//   };
//   students.push(newStudents);
//   await writeData("students.json", students);

//   res.status(200).json({
//     message: "Student added successfully.",
//     newStudents,
//   });
// });

router.post("/students", async (req, res, next) => {
  try {
    const{name, age, gender, className} = req.body;

    const { error, value } = registerUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        message: error.details[0].message,
        data: null,
        error,
      });
    }

    const students = await readData("students.json");
    const id = uuid4();
    const newStudent = {
      id,
      name: value.name,
      age: value.age,
      gender: value.gender,
      className: value.className,
    };

    students.push(newStudent);
    await writeData("students.json", students);

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: newStudent,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// router.put("/students/:id", async (req, res) => {
//    const id = req.params.id;
//   let students = await readData("students.json");
//   const { name, gender, age,className} = req.body;
//   const index = students.findIndex((student)=> student.id === id);
//   if (index === -1){
//     return res.status(404).json({error:"student not found"})
//   }
//   students[index]= {
//     id: students[index].id,
//     name: !name ? students[index].name : name,
//     age: age !== undefined ? age: age[index].age,
//     gender: gender !== undefined ? gender: gender[index].gender,
//     className: className !== undefined ? className: className[index].className
//   }
//   await writeData("students.json", students) 
//   res.status(200)
//   .json({message:"student updated successfully",
//   students})

// });



// Update student by ID
router.put("/students/:id", async (req, res, next) => {
  try {
    const id = req.params.id; // Get student ID from the URL

    let students = await readData("students.json"); // Read all students from the file

    const index = students.findIndex((student) => student.id === id); // Find the index of the student
    if (index === -1) {
      // If not found, return 404 error
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
        error: null,
      });
    }

    // Validate request body using Joi schema
    const { error, value } = registerUserValidator.validate(req.body, {
      abortEarly: false, // So we get all validation errors, not just the first one
    });

    if (error) {
      // If validation fails, return 422 Unprocessable Entity
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        data: null,
        error: error.details.map((err) => err.message), // Show all error messages
      });
    }

    // Update only the changed fields
    students[index] = {
      id: students[index].id, // Keep the same ID
      name: value.name || students[index].name,
      age: value.age !== undefined ? value.age : students[index].age,
      gender: value.gender || students[index].gender,
      className: value.className || students[index].className,
    };

    await writeData("students.json", students); // Save updated data to file

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: students[index],
      error: null,
    });
  } catch (err) {
    next(err); // If anything goes wrong, pass the error to the error handler
  }
});

router.delete("/students/:id", async (req, res, next) => {
  try {
    const id = req.params.id; // Get the student ID from the URL

    const students = await readData("students.json"); // Load all students

    const findStudent = students.find((student) => student.id === id); // Find the one to delete

    if (!findStudent) {
      // If not found, respond with a 404
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
        error: null,
      });
    }

    // Remove the student from the array
    const newStudentList = students.filter((student) => student.id !== id);

    // Save the updated list
    await writeData("students.json", newStudentList);

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: findStudent,
      error: null,
    });

  } catch (err) {
    next(err); // Send any error to the error handler
  }
});


// router.delete("/students/:id", async (req, res) => {
//   const id = req.params.id;
//   const students = await readData("students.json");

//   const findStudent = students.find((student) => student.id === id);
//   console.log(findStudent);

//   if (!findStudent) {
//     return res.status(404).json({ error: "Student not found." });
//   }

//   const newStudent = students.filter((Student) => Student.id !== id);

//   await writeData("students.json", newStudent);
//   res
//     .status(200)
//     .json({ message: "Students deleted successfully.", findStudent });
// });

module.exports = router;
