const fs = require('fs');
const path = require('path');
const tourssimplePath = path.resolve(__dirname, '../dev-data/data/tours-simple.json');

const tours = JSON.parse(fs.readFileSync(tourssimplePath));

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });
}

exports.getTour = (req, res) => {
    const id = req.params.id;
    if (!tours[id]) return res.status(404).json({
        status: 'Failed',
        message: 'Invalid id'
    });

    const tour = tours.find(object => object['id'] === Number(id));
    
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
    const id = req.params.id * 1;
    if (!tours[id]) return res.status(404).json({
        status: 'Failed',
        message: 'Invalid id'
    });

    return res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
}

exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;
    if (!tours[id]) return res.status(404).json({
        status: 'Failed',
        message: 'Invalid id'
    });

    res.status(204).json({
        status: 'success',
        data: null
    })
}