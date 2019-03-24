const express = require("express");
const router = express.Router();
const pool = require("./pool");

router.get("/", (req, res) => {
  //console.log("getting thangs");
  pool
    .query('SELECT * FROM "thangs-table" ORDER BY "completed", "thang_date";')
    .then(result => {
      res.send(result.rows);
    });
});
router.post("/", (req, res) => {
    let thang = req.body;
    console.log("posting thangs, here is thang", thang);
  
    let sqlText = `INSERT INTO "thangs-table" ("thang_name", "thang_date", "completed") VALUES ($1, $2, $3);`;
  pool.query(sqlText, [thang.thang_name, thang.thang_date, thang.completed]).then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      res.sendStatus(500);
      log("Error posting into table, heres the error:", error);
    });
});

router.delete("/:id", (req,res) => {
    let id = req.params.id;
    let sqlText = `DELETE FROM "thangs-table" WHERE id=$1;`
    console.log('this is the thang id', id);
    
    pool.query(sqlText, [id])
    .then(response=>{
        res.sendStatus(201);
    })
    .catch(error=>{
        res.sendStatus(500);
        console.log('this thang was not deleted cuz of this error', error);
        
    })

});

router.put('/:id', (req,res) => {
let id = req.params.id;
let sqlText = `UPDATE "thangs-table" SET "completed"=$1 WHERE id=$2`;
pool.query(sqlText, [true, id])
.then(response => {
res.sendStatus(201);
})
.catch(error=>{
    res.sendStatus(500);
    console.log('the put function did not work, heres the error, ', error );
    
})
});

module.exports = router;
