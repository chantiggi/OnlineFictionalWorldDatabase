module.exports = function(){
    var express = require('express');
    var router = express.Router();
  

    function getUniverses(res, mysql, id, context, complete){
      var query = "SELECT Universe.univName AS Name, Universe.univDescription AS Description, User.userID AS id FROM User, au.UserID, au.UniverseID FROM AuthorUniverses au " +
          "LEFT JOIN User ON au.UserID=User.UserID " +
          "LEFT JOIN Universe ON au.UniverseID=Universe.UniverseID WHERE User.UserID = ?";
      var inserts = [id];
  
      mysql.pool.query(query, inserts, function(error, results, fields){
          if(error){
              console.log(error);
              res.write(JSON.stringify(error));
              res.end();
          }
          context.dashboard = results;
          complete();
      });
  }

    router.get('/', function(req, res){
      var params = {};
  
      var callbackCount = 0;
      var context = {};
      var mysql = req.app.get('mysql');
      getUniverses(res, mysql, context, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 1){
              res.render('dashboard', context);
          }
  
      }
  });
  
    return router;
  }();