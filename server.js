const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const db = {
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
    res.send(db.users);
});

app.post('/signin', (req, res) => {
    //change condition to if (bcrypt.compare(input, hash))
    if (req.body.email === db.users[0].email &&
        req.body.password === db.users[0].password) {
        res.json(db.users[0]);
    } else {
        res.status(400).json('Error logging in');
    }
});


app.post('/register', ((req, res) => {
    const {name, email, password} = req.body;

    bcrypt.hash(password, null, null, function (err, hash) {
            console.log(hash);
            //save in db
        }
    );

    const newUser = {
        name: name,
        email: email,
        joined: new Date(),
        id: '125',
        entries: 0
    };
    console.log(newUser);
    db.users.push(newUser);
    res.json(db.users[db.users.length - 1]);
}));


app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;

    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });

    if (!found) {
        res.status(400).json('User not found');
    }
});

app.put('/image', (req, res) => {
    const {id} = req.body;
    let found = false;

    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });

    if (!found) {
        res.status(400).json('User not found');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

