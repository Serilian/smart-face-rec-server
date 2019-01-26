const Clarifai = require('clarifai');
const apiKey = require('../properties/app.properties');


const app = new Clarifai.App({
    apiKey: apiKey.CLARIFAIAPIKEY
});

const handleAPICall = (req, res) => {
    app.models
        .predict(
            Clarifai.FACE_DETECT_MODEL,
            req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Unable to work with API'));
};


const imageHandler = (db) => (req, res) => {
    const {id} = req.body;

    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]));
};

module.exports = {
    imageHandler: imageHandler,
    handleAPICall: handleAPICall
};