//Name: Gan Wen Tao
// Admission No: p2200378
// Class: DIT/FT/1B/10

const db = require('./databaseConfig');

const commentDb = {
    getComment: function (title, callback) {
        // get the db connection
        const conn = db.getConnection();
        // connect to the database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                return callback(err, null);
            }
            // connection successful
            else {
                // create a sql query
                const sql = 'select * from `comment` join film on `comment`.film_id = film.film_id where film.title = ? ';
                // execute the sql statement
                conn.query(sql, [title], function (err, result) {
                    // connection end
                    conn.end();
                    // return error
                    if (err) {
                        return callback(err, null);
                    }
                    // return data get from database
                    else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    addComment: function (name, comment, score, title, callback) {
        // get the db connection
        const conn = db.getConnection();
        // connect to the database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                return callback(err, null);
            }
            // connection successful
            else {
                // create a sql query
                const sql = 'insert into comment (user, comment, score, film_id) value (?, ?, ?, (select film.film_id from film where film.title = ?))';
                // execute the sql statement
                conn.query(sql, [name, comment, score, title], function (err, result) {
                    // connection end
                    conn.end();
                    // return error
                    if (err) {
                        return callback(err, null);
                    }
                    // return data get from database
                    else {
                        return callback(null, result);
                    }
                });
            }
        })
    }
}

module.exports = commentDb;