const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

const db = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'fhagno',
        password: '',
        database: 'smart-brain'
    }
});


const dbMock = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@john.com',
            password: 'password',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@sally.com',
            password: '1234',
            entries: 0,
            joined: new Date()
        }
    ]
};

app.get('/', (req, res) => {
    db.select('*').from('users')
        .then(users => {
            res.json(users);
            console.log(users);
        });
});

app.post('/signin', (req, res) => {
    //change condition to if (bcrypt.compare(input, hash))
    if (req.body.email === dbMock.users[0].email &&
        req.body.password === dbMock.users[0].password) {
        res.json(dbMock.users[0]);
    } else {
        res.status(400).json('Error logging in');
    }
});

app.post('/register', ((req, res) => {
    const {name, email, password} = req.body;

    // bcrypt.hash(password, null, null, function (err, hash) {
    //         console.log(hash);
    //         //save in db
    //     }
    // );

    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        }).then(user => {
        res.json(user[0]);
    }).catch(err => res.status(400).json('Unable to register: ' + err.detail));
}));


app.get('/profile/:id', (req, res) => {
    const {id} = req.params;

    db.select('*').from('users').where({id: id})
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('User not found')
            }
        });
});

app.put('/image', (req, res) => {
    const {id} = req.body;

    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

