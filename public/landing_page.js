module.exports = function () {
	var express = require('express');
	var router = express.Router();

	//function to get userID of the username that's being logged in
	//and redirect to the user's dashboard
	router.post('/', function (req, res) {
		var mysql = req.app.get('mysql');
		var sql = "SELECT userID, username, password FROM User "
			+ "WHERE username = ?";
		var inserts = req.body.username;
		sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			else {
				//right now the page just reloads if username doesn't
				//exist or if password is incorrect - should probably
				//show some alert, etc
				if (results === undefined || results.length === 0) {
					res.redirect('/');
				}
				else if (results[0].password != req.body.password) {
					res.redirect('/');
				}
				else {
					//if username and password are correct, go to appropriate dashboard
					res.redirect('/dashboard/' + results[0].userID);
				}
			}
		})
	});

	return router;
}();