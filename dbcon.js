var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs361_higginbc',
    password        : '5000',
    database        : 'cs361_higginbc'
});
module.exports.pool = pool;