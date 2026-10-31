import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    year: "",
    mobile: ""
  });

  const [errors, setErrors] = useState({});

  // Get students from backend
  const getStudents = async () => {
    try {
      const response = await axios.get("https://student-management-system-uhdl.onrender.com");
      setStudents(response.data);
    } catch (error) {
      console.log("Error fetching students:", error);
    }
  };

  // Load students when page opens
  useEffect(() => {
    getStudents();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate form
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.course.trim()) {
      newErrors.course = "Course is required";
    }

    if (!formData.year) {
      newErrors.year = "Year is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Add student
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post("https://student-management-system-uhdl.onrender.com", {
        name: formData.name,
        email: formData.email,
        course: formData.course,
        year: Number(formData.year),
        mobile: formData.mobile
      });

      alert("Student added successfully!");

      // Clear form
      setFormData({
        name: "",
        email: "",
        course: "",
        year: "",
        mobile: ""
      });

      setErrors({});

      // Refresh student list
      getStudents();

    } catch (error) {
      console.log("Error adding student:", error);
      alert("Could not add student");
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
    try {
      await axios.delete(`https://student-management-system-uhdl.onrender.com/${id}`);

      alert("Student deleted successfully!");

      getStudents();

    } catch (error) {
      console.log("Error deleting student:", error);
      alert("Could not delete student");
    }
  };

  return (
    <div className="app">

      <div className="container">

        <h1>Student Management System</h1>

        <p className="subtitle">
          Add and manage student records
        </p>

        {/* FORM */}

        <div className="form-card">

          <h2>Add Student</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* Name */}

              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter student name"
                  value={formData.name}
                  onChange={handleChange}
                />

                {errors.name && (
                  <span className="error">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email */}

              <div className="form-group">
                <label>Email</label>

                <input
                  type="text"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <span className="error">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Course */}

              <div className="form-group">
                <label>Course</label>

                <input
                  type="text"
                  name="course"
                  placeholder="Enter course"
                  value={formData.course}
                  onChange={handleChange}
                />

                {errors.course && (
                  <span className="error">
                    {errors.course}
                  </span>
                )}
              </div>

              {/* Year */}

              <div className="form-group">
                <label>Year</label>

                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>

                {errors.year && (
                  <span className="error">
                    {errors.year}
                  </span>
                )}
              </div>

              {/* Mobile */}

              <div className="form-group">
                <label>Mobile</label>

                <input
                  type="text"
                  name="mobile"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                />

                {errors.mobile && (
                  <span className="error">
                    {errors.mobile}
                  </span>
                )}
              </div>

            </div>

            <button type="submit" className="add-btn">
              Add Student
            </button>

          </form>

        </div>

        {/* STUDENT LIST */}

        <div className="students-section">

          <div className="section-header">
            <h2>Students</h2>

            <span className="count">
              Total: {students.length}
            </span>
          </div>

          {students.length === 0 ? (

            <div className="empty">
              <p>No students added yet.</p>
              <span>Add your first student using the form above.</span>
            </div>

          ) : (

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Mobile</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {students.map((student) => (

                    <tr key={student.id}>

                      <td>{student.id}</td>

                      <td className="student-name">
                        {student.name}
                      </td>

                      <td>{student.email}</td>

                      <td>{student.course}</td>

                      <td>
                        {student.year}
                        {student.year === 1
                          ? "st"
                          : student.year === 2
                          ? "nd"
                          : student.year === 3
                          ? "rd"
                          : "th"}{" "}
                        Year
                      </td>

                      <td>{student.mobile}</td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => deleteStudent(student.id)}
                        >
                          Delete
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default App;