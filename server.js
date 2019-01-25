const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const helmet = require('helmet');
const register = require("./controllers/register");
const home = require("./controllers/home");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const dbProperties = require("./properties/db.properties");

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

const db = require('knex')(dbProperties.pg);

app.get('/', (req, res) => {
        home.homeHandler(req, res, db)
    }
);

app.post('/signin', (req, res) => {
    signin.signinHandler(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt)
});

app.get('/profile/:id', (req, res) => {
    profile.profileHandler(req, res, db);
});

app.put('/image', (req, res) => {
    image.imageHandler(rq, res, db);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

