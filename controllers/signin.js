const signinHandler = (db, bcrypt) => (req, res) => {
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
};

module.exports = {
  signinHandler:  signinHandler
};