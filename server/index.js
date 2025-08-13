  const express = require('express');
  const app = express();
  const mongoose = require('mongoose');
  const cors = require('cors');
  require('dotenv').config();
  const authRoutes = require('./routes/authRoutes');
  const studentRoutes = require('./routes/studentRoute');
  const superadminRoutes = require('./routes/superadminRoute');
  const adminRoute = require('./routes/adminRoute');
  const path = require('path');
  const contactRoutes = require('./routes/contactRoutes');
  const commonRoute= require('./routes/commonRoute');
const paymentRoutes = require("./routes/paymentRoutes");
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');
const progressRoutes = require('./routes/progressRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
  // Middleware to parse JSON bodies
  app.use(express.json());

  // CORS setup
  app.use(cors());

  // Import auth routes
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Use the auth routes
  app.use('/api/auth', authRoutes);


  // Connect to MongoDB
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));


    app.use('/api/student', studentRoutes);
    app.use('/api/superadmin', superadminRoutes);
    app.use('/api/admin', adminRoute);
    app.use('/api/', commonRoute);
    app.use('/api', contactRoutes);
    app.use('/admin', require('./routes/commonRoute'));
    app.use('/superadmin', require('./routes/commonRoute'));
  // app.use('/api/examattempt', examAttemptRoutes);
app.use("/api/payments", paymentRoutes);
app.use('/api/exam', require('./routes/ExamRoute'));
app.use('/api/',studyMaterialRoutes);
app.use('/api/progress',progressRoutes);
app.use('/api/',certificateRoutes);
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
