/* eslint-disable strict */
/* eslint-disable no-console */
const app = require('./app');
const knex = require('knex');
const { NODE_ENV, DB_URL, PORT } = require('./config');

const db = knex({
  client: 'pg',
  connection: DB_URL
});

app.set('db', db);

app.listen(PORT, () => console.log(`Server listening in ${NODE_ENV} mode at http://localhost:${PORT}`));