//Name: Gan Wen Tao
// Admission No: p2200378
// Class: DIT/FT/1B/10

const db = require('./databaseConfig');

const categoryDb = {
    getCategory: function(callback) {
        // get the db connection
        const conn = db.getConnection();
        // connect to database
        conn.connect(function(err) {
            // connection fail
            if (err) {
                // return error
                return callback(err, null);
            }
            //connection successful
            else{
                 // create a sql query
                 const sql = 'select name from category';
                 //execute the sql statement
                 conn.query(sql, function (err, result) {
                     // connection end
                     conn.end();
                     // return error
                     if (err) {
                         return callback(err, null);
                     }
                     else {
                         // return data get from database
                         return callback(null, result);
                     }
                 });
            }
        })
    }
}

module.exports = categoryDb;