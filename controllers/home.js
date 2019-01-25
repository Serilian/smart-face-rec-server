

const homeHandler = (req, res, db)=> db.select('*').from('users')
    .then(users => {
        res.json(users);
    });

module.exports = {
    homeHandler: homeHandler
};