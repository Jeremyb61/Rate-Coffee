var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ratecoffee');

var path = require('path');
app.use(express.static(__dirname + '/public/dist/public'));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

var RateSchema = new mongoose.Schema({
    star: { type: String, default: "" },
    comments: { type: String, default: "" }
});

mongoose.model('Ratings', RateSchema);
var Ratings = mongoose.model('Ratings');

var CoffeeSchema = new mongoose.Schema({
    roastername: { type: String, default: "", required: [true, "Please enter the roasters name"], minlength: [2, "Name must be 2 or more characters"] },
    varietal: { type: String, default: "", required: [true, "Please enter the varietal"] },
    region: { type: String, default: "", required: [true, "Please enter the region"] },
    image: { type: String, required: [true, "Please enter the image url"] },
    rating: [RateSchema]
}, { timestamps: true });

mongoose.model('Coffees', CoffeeSchema);
var Coffee = mongoose.model('Coffees');

app.post('/coffee', function (req, res) {
    coffee_inst = new Coffee(req.body)
    console.log(req.body);
    coffee_inst.save(function (err, coffee) {
        if (err) {
            res.json({
                status: false,
                err: err
            });

        } else {
            console.log(coffee);
            console.log("success adding new coffee")
            res.json({status: true, result :coffee});
        }
    });
})
app.get('/coffee', function (req, res) {
    Coffee.find({}).sort({ createdAt: 'desc' }).exec(function (err, data) {
        if (err) {
            console.log("Server Error, at get all coffees route");
        } else {
            console.log("Success at get all coffees route");
            res.json(data);
        }
    })
})
app.post('/coffee/:id', function (req, res) {
    console.log("POST COFFEE/ID, req.body", req.body)
    console.log("POST COFFEE/ID, req.params", req.params)
    Coffee.findOneAndUpdate({ _id: req.params.id }, { $push: { rating: [ {comments: req.body.comments, star: req.body.star} ] }}, function (err, data) {
        if (err) {
            console.log(req.body)
            console.log("SERVER ERROR, submitting comment/rating");
        } else {
            console.log(data)
            console.log("Succes submitting comment/rating");
            res.json(data);
        }
    })
});
app.get('/coffee/:id', function (req, res) {
    Coffee.findOne({ _id: req.params.id }, function (err, data) {
        if (err) {
            console.log('SERVER ERROR, get coffee by id');
        } else {
            console.log(data)
            console.log('Succes getting coffee by id')
            res.json(data)
        }
    });
});
app.listen(8000, function () {
    console.log("Listening on 8000");
})