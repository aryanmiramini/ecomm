const { Pool } = require('pg');

const connectionString = 'postgresql://postgres:StrongPassword123@localhost:5432/ecommerce_db?schema=public';
const pool = new Pool({ connectionString });

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error', err);
  } else {
    console.log('Connected successfully', res.rows[0]);
  }
  pool.end();
});

