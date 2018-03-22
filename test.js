'use strict';
 
const chai = require('chai');  
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('./server.js');

describe('GET REQUEST', function(){
    this.timeout(5000);
    it('SHOULD RETURN A ORDER',function(){
        return chai.request(app)
        .get('/admin/order/34')
        .then(function(res){
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
        })
    });
    it('SHOULD RETURN NOT FOUND', function() {
        return chai.request(app)
          .get('/someOtherPath')
          .then(function(res) {
            throw new Error('Path exists!');
          })
          .catch(function(err) {
            expect(err).to.have.status(404);
          });
      });
});
describe('POST REQUEST', function(){
    this.timeout(5000);
      it('SHOULD ADD NEW ORDER', function() {
        return chai.request(app)
          .post('/admin/order')
          .set("Content-Type", "application/json")
          .send({
            "cid": '420',
            "pstat":'XXXX',
            "ostat":'XXXXZZZZ'
          })
          .then(function(res){
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.be.an('object').that.have.key({id:30,Status:'SUCCESS'});
          });
      });
      it('SHOULD RETURN BAD REQUEST', function() {
        return chai.request(app)
          .post('/someOtherURL')
          .type('form')
          .send({
            color: 'YELLOW'
          })
          .then(function(res) {
            throw new Error('Invalid content type!');
          })
          .catch(function(err) {
            expect(err).to.have.status(404);
          });
      });
  });
describe('DELETE REQUEST',function(){
    this.timeout(5000);
    it('SHOULD CANCEL THE ORDER',function(){
      return chai.request(app)
    .post('/admin/order/')
    .set("Content-Type", "application/json")
        .send({
            "cid": '420',
            "pstat":'XXXX',
            "ostat":'XXXXZZZZ'
        })   
        .then(function(res){
            chai.request(app)
            .delete('/admin/order/'+res.body.id)
            .then(function(res){
                expect(res).to.be.have.status(200);
                expect(res.body).to.be.an('object').that.have.key({Status : "SUCCESSFULLY DELETED"});
            });
        });
    });
});

describe('PUT REQUEST',function(){
    this.timeout(5000);
      it('SHOULD MODIFY',function(){
        return  chai.request(app)
        .post('/admin/order/')
        .set("Content-Type", "application/json")
        .send({
            "cid": '420',
            "pstat":'XXXX',
            "ostat":'XXXXZZZZ'
        })
        .then(function(res){
            chai.request(app)
            .put('/admin/order/'+res.body.id)
            .set("Content-Type", "application/json")
            .send({
              "cid" : "432",
              "pstat":'XXXX',
              "ostat":'XXXXZZZZ'
            })
            .then(function(res){
                expect(res).to.be.have.status(200);
                expect(res.body).to.be.an('object').that.have.key({ Status : "SUCCESSFULLY UPDATED" });
            })
        })
      })
  });
