var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

var Employee = require('./models/employee');
 
//get all employee data from db
app.get('/api/employees', (req, res) => {
	Employee.find()
	  .then(employees => res.json(employees))
	  .catch(err => res.status(500).send(err));
  });

// get a employee with ID of 1
app.get('/api/employees/:employee_id', (req, res) => {
  const id = req.params.employee_id;
  Employee.findById(id)
    .then(employee => res.json(employee))
    .catch(err => res.status(500).send(err));
});


// create employee and send back all employees after creation
app.post('/api/employees', (req, res) => {
	const { name, salary, age } = req.body;
	Employee.create({ name, salary, age })
	  .then(employee => res.json(employee))
	  .catch(err => res.status(500).send(err));
  });

// create employee and send back all employees after creation
app.put('/api/employees/:employee_id', (req, res) => {
	const id = req.params.employee_id;
	const { name, salary, age } = req.body;
	Employee.findByIdAndUpdate(id, { name, salary, age })
	  .then(() => res.send(`Successfully! Employee updated - ${name}`))
	  .catch(err => res.status(500).send(err));
  });

// delete a employee by id
app.delete('/api/employees/:employee_id', (req, res) => {
	const id = req.params.employee_id;
	Employee.findByIdAndRemove(id)
	  .then(() => res.send('Successfully! Employee has been Deleted.'))
	  .catch(err => res.status(500).send(err));
  });

  app.listen(port, () => console.log(`App listening on port ${port}`));
