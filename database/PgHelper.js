const Pg = require('pg')

const pool = new Pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'KingstonBot',
    password: process.env.KINGSTON_BOT_DB_PASS,
    port: '5432'
  })

module.exports = pool