/**
 * Created by dyorex on 2016-10-02.
 */
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('./server/config');

describe('Server testing', function () {
    var url = 'http://localhost:3000';
    before(function(done) {
        mongoose.connect(config.db);
        done();
    });

    describe('Server', function() {
        it('should respond to /', function (done) {
            request(url)
                .get('/')
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
    });

    describe('User', function() {
        it('should return error trying to sign up with the same email', function(done) {
            var user = {
                email: 'dyorex@gmail.com',
                password: 'test',
                fullname: 'CY'
            };
            request(url)
                .post('/auth/reg')
                .send(user)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 409);
                    done();
                });
        });
        it('should return error trying to sign in with the wrong combination of username and password', function(done) {
            var user = {
                email: 'dyorex@gmail.com',
                password: 'test'
            };
            request(url)
                .post('/auth/login')
                .send(user)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 401);
                    done();
                });
        });
    });

    describe('Feed', function() {
        it('should return error tyring to get the feed without login', function(done) {
            request(url)
                .get('/feed')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 400);
                    done();
                });
        });
    });
});