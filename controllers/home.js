const homeHandler = (db) => (req, res)=> db.select('*').from('users')
    .then(users => {
        res.json(users);
    });

module.exports = {
    homeHandler: homeHandler
};