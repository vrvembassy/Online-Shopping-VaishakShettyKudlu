var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 3000;
var router = express.Router();
// let connectionString = {
//     host: "localhost",
//     port: 5432,
//     user: "postgres",
//     password: "root",
//     database: "shoppingdb"
//   }
const conString = "postgres://postgres:root@localhost/shoppingdb";
const con = new pg.Client(conString);
con.connect();

const query1 = "DELETE FROM orders WHERE id=$1"
const query2 = "SELECT * FROM orders WHERE id=$1"
const query3 = "UPDATE orders set cId=$1, pStatus=$2, oStatus=$3 WHERE id=$4"
const query4 = "INSERT INTO orders(cId, pStatus, oStatus) values($1, $2, $3) returning id as retid"

router.use(function (req, res, next) {
    //console.log('Logging of request will be done here');
    next();
});

//POST METHOD
router.post('/order',function (req, res) {
    let cid = req.body.cid;
    let pstat = req.body.pstat;
    let ostat = req.body.ostat;
    con.query(query4, [cid, pstat, ostat],(err, resp) => {
        if (err) { res.status(500).send({ Status : "Internal Server Error" });}
        if(!resp) {
            res.status(404).send({ Status : "COULD NOT PLACE ORDER" });
        }
            res.status(200).send({ id : resp.rows[0].retid,Status : "SUCCESS" });     
    });
});

//GET METHOD
router.get('/order/:id',function (req, res, next) {
    var id = req.params.id;
    con.query(query2,[id],(err, resp) => {
        if (err) { res.status(500).send({ Status : "Internal Server Error" });}
        if(resp.rowCount == 0) {
            res.status(404).send({ Status : "No records found in the database" });
        } else {
            res.status(200).send({ Status : "SUCCESS" });
        }
    });
});

//PUT METHOD
router.put('/order/:id',function (req, res, next) {
    let cid = req.body.cid;
    let pstat = req.body.pstat;
    let ostat = req.body.ostat;
    var id = req.params.id;
    con.query(query3, [cid, pstat, ostat, id], (err, resp) => {
        if (err) { res.status(500).send({ Status : "Internal Server Error" });}
        if(resp.rowCount == 0) {
            res.status(404).send({ Status : "No records found in the database" });
        } else {
            res.status(200).send({ Status : "SUCCESSFULLY UPDATED" });
        }
    });
});

//DELETE METHOD
router.delete('/order/:id',function (req, res, next) {
    var id = req.params.id;
    con.query(query1, [id],(err, resp) => {
        if (err) { res.status(500).send({ Status : "Internal Server Error" });}
        if(resp.rowCount == 0) {
            res.status(404).send({ Status : "No records found in the database" });
        } else {
            res.status(200).send({ Status : "SUCCESSFULLY DELETED" });
        }
    });
});

app.use('/admin', router,(req,res,next)=>{
    res.status(200),send("success");
});
var server = app.listen(port, function(){
    console.log('REST API is runnning at ' + port);
});

module.exports = server;