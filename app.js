const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Cors=require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(Cors());

// Database Connection
mongoose.connect("mongodb+srv://anishpdm:anishpdm@cluster0.cp5gozh.mongodb.net/visitor_entry_app", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/security', require('./routes/securityRoutes'));

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
