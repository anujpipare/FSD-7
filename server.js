// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


    const cors = require('cors');

// Use CORS middleware
app.use(cors());


// Define a Student schema
const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
});

// Create a Student model
const Student = mongoose.model('Student', studentSchema);

// Route to register a new student
app.post('/api/students', async (req, res) => {
    const { firstName, lastName, rollNo, password, contactNumber } = req.body;

    const student = new Student({ firstName, lastName, rollNo, password, contactNumber });
    try {
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: 'Error registering student', error });
    }
});

// Route to get all students
// Get all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});


// Route to update student details
// Update student contact number based on roll number
app.put('/api/students/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    const { contactNumber } = req.body;

    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { rollNo: rollNo },
            { contactNumber: contactNumber },
            { new: true } // Return the updated student data
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating student contact' });
    }
});


// Route to delete a student
// DELETE a student based on Roll No/ID
app.delete('/api/students/:rollNo', async (req, res) => {
    try {
      const rollNo = req.params.rollNo;
      const deletedStudent = await Student.findOneAndDelete({ rollNo });
  
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting student', error });
    }
  });
  

// Define the port
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
