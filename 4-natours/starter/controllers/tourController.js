const fs = require('fs');
const path = require('path');
const tourssimplePath = path.resolve(__dirname, '../dev-data/data/tours-simple.json');

const tours = JSON.parse(fs.readFileSync(tourssimplePath));

exports.checkID = (req, res, next, val) => {
    const id = req.params.id * 1;
    console.log(`Tour id is: ${val}`);

    if (!tours[id]) return res.status(404).json({
        status: 'Failed',
        message: 'Invalid id'
    });
    return next();
}

exports.checkBody = (req, res, next) => {
    const body = req.body;
    console.log(body);
    if (!body.name || !body.price) return res.status(400).json({
        status: 'Failed',
        message: 'Missing name or price'
    });
    return next();
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });
}

exports.getTour = (req, res) => {
    
    const tour = tours.find(object => object['id'] === Number(req.params.id));

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }});
}

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    console.log(newTour)
    fs.writeFile(tourssimplePath, JSON.stringify(tours), err => {
        if (err) return res.status(500).send(err);
        res.status(201).json({
            status:'success',
            data: {
                tour: newTour
            }
        })
    });
}

exports.updateTour = (req, res) => {
    
    return res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
}