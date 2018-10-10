var express = require('express');

const bodyParser = require('body-parser');
var Task = require('../models/task');
const cors = require('./cors');
var users = require('../routes/users');

var passport = require('passport');
var router = express.Router();
router.use(bodyParser.json());

router.route('/tasks/:token')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res, next) => {
	if(req.body.token !== '' && req.body.task !== '' && req.body.new_date !== ''){
		var data = new Task(req.body);
		data.save()
		.then((task) => {
			res.statusCode = 200;
        	res.setHeader('Content-Type', 'application/json');
        	res.json(task);
		})
	}
	else{
		console.log("Data not saved successfully")
	}
})
.get(cors.corsWithOptions, (req, res, next) => {
	Task.find({"token": req.params.token})
		.then((task) => {
			res.statusCode = 200;
        	res.setHeader('Content-Type', 'application/json');
        	res.json(task);
	    }, (err) => next(err))
	    .catch((err) => next(err));	
});

router.route('/tasks/:token/:id')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.delete(cors.corsWithOptions, (req, res, next) => {
	Task.findByIdAndRemove({"_id": req.params.id}, 
		(err, data) => {
			res.json(data);
		})

});

router.route('/tasks/:id')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.put(cors.corsWithOptions, (req, res, next) => {
	Task.findByIdAndUpdate({"_id": req.params.id}, {"task": req.body.task}, {new: true}, (err, data) => {
		if(data){
			console.log(data);
		}
	})
});


module.exports = router;