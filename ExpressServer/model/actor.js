//Name: Gan Wen Tao
// Admission No: p2200378
// Class: DIT/FT/1B/10

const db = require('./databaseConfig');


const actorDb = {
    // Endpoint 1: handle get request to get a specific actor record
    getActor: function (actor_id, callback) {
        // get the db connection
        const conn = db.getConnection();
        // connect to database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                // return error
                return callback(err, null);
            }
            //connection successful
            else {
                // create a sql query
                const sql = 'select actor_id, first_name, last_name from actor where actor_id = ?';
                //execute the sql statement
                conn.query(sql, [actor_id], function (err, result) {
                    // connection end
                    conn.end();
                    // return error
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        // when no data get from database
                        if (result.length == 0) {
                            callback(null, null);
                        }
                        // return data get from database
                        return callback(null, result);
                    }
                });
            }
        });
    },

    // Endpoint 2: handle get request to get all the actors
    getActors: function (limit, offset, callback) {
        // get the db connection
        const conn = db.getConnection();
        // connect to database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                // return error
                return callback(err, null);
            }
            // connection successful
            else {
                // create a sql query
                const sql = 'select actor_id, first_name, last_name from actor limit ? offset ?';
                // execute the sql statement
                conn.query(sql, [limit, offset], function (err, result) {
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

    // Endpoint 3: handle post request to add a actor record
    addActor: function (first_name, last_name, callback) {
        // get the db connection
        const conn = db.getConnection();
        // connect to database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                // return error
                return callback(err, null);
            }
            // connection successful
            else {
                // create a sql query
                const sql = 'insert into actor (first_name, last_name) values (?, ?);';
                // execute the sql statement
                conn.query(sql, [first_name, last_name], function (err, result) {
                    // connection end
                    conn.end();
                    if (err) {
                        // return error
                        return callback(err, null);
                    }
                    else {
                        // return data get from database
                        return callback(null, result);
                    }
                });
            }
        })
    },

    // Endpoint 4: handle put request to update actor's first_name or last_name or both
    updateActor: function (data, callback) {
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
                const sql = data.sql;
                // execute the sql statement
                conn.query(sql, data.update_data, function (err, result) {
                    // connection end
                    conn.end();
                    if (!err) {
                        // actor_id not found in database
                        if (result.affectedRows == 0) {
                            return callback(null, null);
                        }
                        else {
                            // successful update
                            return callback(null, result);
                        }
                    }
                    // return error
                    else {
                        return callback(err, null);
                    }
                });
            }
        });
    },

    // Endpoint 5: handle delete request to delete a actor
    deleteActor: function (actor_id, callback) {
        // get the db connection
        const conn = db.getConnection();
        // get connect to database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                return callback(err, null);
            }
            //connection successful
            else {
                // create sql queries
                const sql1 = 'delete from film_actor where actor_id = ?';
                const sql2 = 'delete from actor where actor_id = ?';
                // execute sql statement to delete data in film_actor table to avoid foreign key constraint
                conn.query(sql1, [actor_id], function (err, result) {
                    // return error
                    if (err) {
                        callback(err, null);
                    }

                    else {
                        // execute sql statement to delete data in actor table
                        conn.query(sql2, [actor_id], function (err, result) {
                            // return error
                            if (err) {
                                return callback(err, null);
                            }
                            else {
                                // return when actor_id not found
                                if (result.affectedRows == 0) {
                                    return callback(null, null);
                                }
                                // actor successful deleted
                                return callback(null, result);
                            }
                        });
                    }
                });
            }
        });
    },

}

module.exports = actorDb;