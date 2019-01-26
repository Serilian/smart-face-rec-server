const pg =
    {
        client: 'pg',
        connection: {
            host: process.env.DATABASE_URL,
            ssl: true
        }

    };

module.exports = {
    pg: pg
};