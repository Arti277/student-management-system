/*const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const file = "./students.json";


// GET - Get all students
app.get("/students", (req, res) => {

    const data = fs.readFileSync(file, "utf-8");

    const students = JSON.parse(data);

    res.json(students);
});


// POST - Add student
app.post("/students", (req, res) => {

    const data = fs.readFileSync(file, "utf-8");

    const students = JSON.parse(data);

    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        email: req.body.email,
        course: req.body.course,
        year: req.body.year,
        mobile: req.body.mobile
    };

    students.push(newStudent);

    fs.writeFileSync(file, JSON.stringify(students, null, 2));

    res.json({
        message: "Student added successfully",
        student: newStudent
    });
});


// DELETE - Delete student
app.delete("/students/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const data = fs.readFileSync(file, "utf-8");

    let students = JSON.parse(data);

    students = students.filter(student => student.id !== id);

    fs.writeFileSync(file, JSON.stringify(students, null, 2));

    res.json({
        message: "Student deleted successfully"
    });
});


app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
*/
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

// Student Schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    course: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    mobile: {
        type: String,
        required: true
    }
});

// Student Model
const Student = mongoose.model("Student", studentSchema);


// GET all students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);

    } catch (error) {
        res.status(500).json({
            message: "Error getting students"
        });
    }
});


// POST new student
app.post("/students", async (req, res) => {
    try {
        const student = new Student({
            name: req.body.name,
            email: req.body.email,
            course: req.body.course,
            year: req.body.year,
            mobile: req.body.mobile
        });

        const savedStudent = await student.save();

        res.status(201).json({
            message: "Student added successfully",
            student: savedStudent
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding student"
        });
    }
});


// DELETE student
app.delete("/students/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully",
            student: deletedStudent
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting student"
        });
    }
});


// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});