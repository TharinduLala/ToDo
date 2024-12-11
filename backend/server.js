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


// const { parse, format } = require('date-fns');

// // Original date string
// const dateString = '25-12-2024 11:18:33 PM';

// // Parse the date string into a Date object using a custom format
// const parsedDate = parse(dateString, 'dd-MM-yyyy hh:mm:ss a', new Date());

// // Extract components
// const day = format(parsedDate, 'dd');
// const month = format(parsedDate, 'MM');
// const year = format(parsedDate, 'yyyy');
// const hour = format(parsedDate, 'HH');  // 24-hour format
// const minute = format(parsedDate, 'mm');

// console.log(`Day: ${day}, Month: ${month}, Year: ${year}, Hour: ${hour}, Minute: ${minute}`);
