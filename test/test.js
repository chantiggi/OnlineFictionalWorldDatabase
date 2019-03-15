var expect = require('chai').expect;
var request = require('request');

describe('Testing Page Routes', function() {
  it('Testing landing page status', function (done) {
    request('http://localhost:3000/', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Testing sign up page', function (done) {
    request('http://localhost:3000/sign_up', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Testing login page', function (done) {
    request('http://localhost:3000/login', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Testing logout page', function (done) {
    request('http://localhost:3000/logout', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Testing dashboard page', function (done) {
    request('http://localhost:3000/dashboard', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Testing manage universe page', function (done) {
    request('http://localhost:3000/manageuniverse', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Testing an non-existing page, looking for 404 status code', function (done) {
    request('http://localhost:3000/not_exist', function (error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });
});
