const express = require('express');
const router = express.Router();
const pool = require('./pool');

router.get('/', (req,res) => {
console.log('getting thangs');
pool.query('SELECT * FROM "thangs-table" ORDER BY "thang_date";')
.then((result) => {
    res.send(result.rows);
})
});












module.exports = router;
