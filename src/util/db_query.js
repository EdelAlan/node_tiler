const {
  Pool
} = require('pg');
const client = new Pool({
  user: 'docker',
  host: 'localhost',
  database: 'docker',
  password: 'docker',
  port: 5432,
});
client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack);
    return err.stack;
  } else {
    console.log('Postgre connected\n\n\n');
  }
});

module.exports = async (
  query,
  params
) => {
  return await client.query(query, params)
    .then(res => res.rows)
    .catch(e => console.error(e));
}