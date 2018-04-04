var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//order database 
var db = require('../db/order_db');

//adding order 
router.post('/addOrder',function (req, res) {
    createOrder(req,res);
});
function createOrder(req,res){
    let cid = req.body.cid;
    let pstat = req.body.pstat;
    let ostat = req.body.ostat;
    console.log(cid+''+pstat+""+ostat);
    db.addOrders(cid,pstat,ostat,(err,resp)=>{
        if(err) return res.status(500).send("Internal Server Error");
        if(!resp) res.status(404).send("COULD NOT PLACE ORDER");
        res.status(200).send({orderid:resp, status : "successfully added" });
    })
}
//getting order details by id
router.get('/getOrderById/:id',function (req, res, next) {
    let id = req.params.id;
    db.getOrder(id,(err, resp) => {
        if (err) return res.status(500).send("Internal Server Error");
        if(!resp) return res.status(404).send("No records found in the database");
        res.status(200).send({items:resp});
    });
});

//Modify order details
router.put('/modify/:id',function (req, res, next) {
    let cid = req.body.cid;
    let pstat = req.body.pstat;
    let ostat = req.body.ostat;
    var id = req.params.id;
    db.modifyOrder(cid, pstat, ostat, id, (err, resp) => {
        if (err) return res.status(500).send("Internal Server Error" );
        if(!resp) return res.status(404).send("No records found in the database");
        res.status(200).send({status:"updated successfully"});
    });
});

//delete order details
router.delete('/delete/:id',function (req, res, next) {
    var id = req.params.id;
    db.deleteOrder(id,(err, resp) => {
        if (err)return res.status(500).send("Internal Server Error");
        if(!resp) return res.status(404).send("No records found in the database");
        res.status(200).send({ status : "SUCCESSFULLY DELETED" });
    });
});

module.exports = router;