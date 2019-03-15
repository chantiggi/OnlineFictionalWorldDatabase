module.exports = function(){
    var express = require('express');
    var router = express.Router();
   
    // Functions Here
    function getChaptersForUniv(req, res, mysql, context, complete){
        var inserts = [req.params.univID];
        var query = "SELECT chapterID, chapterNum, chapterTitle, chapterSummary, univID FROM Chapter "
        + "INNER JOIN Universe u ON u.universeID = univID "
        + "WHERE u.universeID = ? "
        + "ORDER BY chapterNum";
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.chapters = results;
            complete();
        })
    }
 
    function getEventsForUniv(req, res, mysql, context, complete){
        var inserts = [req.params.univID];
        var query = "SELECT eventID, eventName, eventDescription, eventTime, eventLocation, univID FROM Event "
        + "WHERE univID = ?";
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.events = results;
            complete();
        })
    }
    
    function getLocationsforUniv(req, res, mysql, context, complete){
        var inserts = [req.params.univID];
        var query = "SELECT locID, locName, locDescription, univID FROM Location "
        + "INNER JOIN Universe u ON u.universeID = univID "
        + "WHERE u.universeID = ?";
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results;
            complete();
        })
    }
    
    function getCharactersForUniv(req, res, mysql, context, complete){
        var inserts = [req.params.univID];
        var query = "SELECT charID, CONCAT(firstName, ' ', lastName) as charName, description, univID FROM Characters "
        + "INNER JOIN Universe u ON u.universeID = univID "
        + "WHERE u.universeID = ?";
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        })
    }

    function getUniverseInfo(req, res, mysql, context, complete) {
        var inserts = [req.params.univID];
        var query = "SELECT universeID, univName, univDescription FROM Universe "
        + "WHERE universeID = ?";
        mysql.pool.query(query, inserts, function (error, results, fields) {
            if(error) {
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }
            context.universe = results[0];
            complete();
        });
    }

        // Insert Location
  router.post('/', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = 'INSERT INTO `Chapter`(`chapterNum`, `chapterTitle`, `chapterSummary`, `univID`) VALUES (?, ?, ?, ?)';
    var inserts = [req.body.chapterNum, req.body.chapterTitle, req.body.chapterSummary, req.body.univID];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }else{
        res.redirect('/manageuniverse/' + req.body.univID);
      }
    });
  });

    router.get('/:univID', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getChaptersForUniv(req, res, mysql, context, complete);
        getEventsForUniv(req, res, mysql, context, complete);
        getLocationsforUniv(req, res, mysql, context, complete);
        getCharactersForUniv(req, res, mysql, context, complete);
        getUniverseInfo(req, res, mysql, context, complete);
        function complete()
        {
            callbackCount++;
            if(callbackCount >= 5){
                res.render('addChapter', context);
            }
        }
    })
  
    return router;
}();