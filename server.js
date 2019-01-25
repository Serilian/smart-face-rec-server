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


app.get('/', (req, res) => {
    db.select('*').from('users')
        .then(users => {
            res.json(users);
            console.log(users);
        });
});

app.post('/signin', (req, res) => {

    const {email, password} = req.body;

    db.select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('Could not find user'));
            } else {
                res.status(400).json('Wrong password');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
});

app.post('/register', ((req, res) => {
    const {name, email, password} = req.body;

    const hash = bcrypt.hashSync(password);

    db.transaction(trx =>
        trx().insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    ).catch(err => res.status(400).json('Unable to register: ' + err.detail));

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

