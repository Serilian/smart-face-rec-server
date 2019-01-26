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
// home.homeHandler(db)
app.get('/', (req, res)=> { res.send('It is working')} );

app.post('/signin', signin.signinHandler(db, bcrypt));

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', profile.profileHandler(db));

app.put('/image', image.imageHandler(db));

app.post('/imageUrl', (req, res) => {image.handleAPICall(req, res)});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

