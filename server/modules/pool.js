const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool({
    database: 'thangs-to-do',
    host: 'localhost',
    port: 5432,
    max:10,
    idleTimeoutMillis: 30000
});

pool.on('connect', ()=>{
    console.log('Postgres Connected! Woot!');
    
})
pool.on('error', (error)=>{
    console.log('Postgres Connection ERROR!', error);
    
})


module.exports = pool;