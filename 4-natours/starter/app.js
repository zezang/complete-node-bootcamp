const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'dev-data/data/tours-simple.json')));

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });
}

const getTour = (req, res) => {
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

const makeTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(path.resolve(__dirname, 'dev-data/data/tours-simple.json'), JSON.stringify(tours), err => {
        if (err) return res.status(500).send(err);
        res.status(201).json({
            status:'success',
            data: {
                tour: newTour
            }
        })
    });
}

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
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
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', makeTour);
app.patch('/api/v1/tours/:id', updateTour)
app.delete('/api/v1/tours/:id', deleteTour)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App running at port ${PORT}`);
});