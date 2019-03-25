const express = require("express");
const router = express.Router();
const pool = require("./pool");

//READ / GET
router.get("/", (req, res) => {
  //console.log("getting thangs");
  pool
    .query('SELECT * FROM "thangs-table" ORDER BY "completed", "thang_date";')
    .then(result => {
    console.log(result);
    res.send(result.rows);
    })
    .catch(error=>{
        res.sendStatus(500);
        console.log('Error in GET', error);
        
    })
});
//CREATE / POST
router.post("/", (req, res) => {
    // let thang = req.body;
    // console.log("posting thangs, here is thang", thang);
  //removed thang var, added req.body...
    let sqlText = `INSERT INTO "thangs-table" ("thang_name", "thang_date", "completed") VALUES ($1, $2, $3);`;
    pool
      .query(sqlText, [
        req.body.thang_name,
        req.body.thang_date,
        req.body.completed
      ])
      .then(result => {
        res.sendStatus(201);
      })
      .catch(error => {
        res.sendStatus(500);
        log("Error posting into table, heres the error:", error);
      });
});

//UPDATE / PUT 
router.put('/:id', (req, res) => {
    let id = req.params.id;
    let sqlText = `UPDATE "thangs-table" SET "completed"=$1 WHERE id=$2`;
    pool.query(sqlText, [true, id])
        .then(response => {
            res.sendStatus(201);
        })
        .catch(error => {
            res.sendStatus(500);
            console.log('the put function did not work, heres the error, ', error);

        })
});

//DELETE
router.delete("/:id", (req,res) => {
    //the :id in url is a VARIABLE that plugs into req.params
    //if '/:taco' req.params.taco
    let id = req.params.id;
    let sqlText = `DELETE FROM "thangs-table" WHERE id=$1;`
    console.log('this is the thang id', id);
    
    pool.query(sqlText, [id])
    .then(response=>{
        res.sendStatus(200);
    })
    .catch(error=>{
        res.sendStatus(500);
        console.log('this thang was not deleted cuz of this error', error);
        
    })

});


module.exports = router;