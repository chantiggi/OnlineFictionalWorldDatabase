module.exports = function(){
    var express = require('express');
    var router = express.Router();
  
    // Functions Here

    //function to add a new user to the database using input provided
    router.post('/', function(req, res){
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO `User`(`username`, `password`, `firstName`, `lastName`, `email`, `userType`) "
      + "VALUES (?, ?, ?, ?, ?, ?)";
      var inserts = [req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.email, req.body.userType];
      sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
        }
        else{
          res.redirect('/dashboard/' + results.insertId);
        }
      })
    });
  
    return router;
  }();