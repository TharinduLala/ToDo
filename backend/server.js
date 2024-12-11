const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const todoRoutes = require('./src/routes/todoRoutes');

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api/users', userRoutes);  
app.use('/api/todos', todoRoutes);  

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
