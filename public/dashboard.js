module.exports = function(){
    var express = require('express');
    var router = express.Router();
  

    function getUniverses(req, res, mysql, context, complete){
        var inserts = [req.params.userID];
      var query = "SELECT un.universeID AS universeID, un.univName AS univName, un.univDescription AS univDescription FROM Universe un "
      + "INNER JOIN AuthorUniverses au ON au.universeID = un.universeID "
      + "INNER JOIN User us ON us.userID = au.userID "
      + "WHERE us.userID = ?";
  
      mysql.pool.query(query, inserts, function(error, results, fields){
          if(error){
              console.log(error);
              res.write(JSON.stringify(error));
              res.end();
          }
          context.universes = results;
          complete();
      });
  }

    router.get('/:userID', function(req, res){
      var callbackCount = 0;
      var context = {};
      var mysql = req.app.get('mysql');
      getUniverses(req, res, mysql, context, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 1){
              res.render('dashboard', context);
          }
  
      }
  });
  
    return router;
}();