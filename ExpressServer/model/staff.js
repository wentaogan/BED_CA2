//Name: Gan Wen Tao
// Admission No: p2200378
// Class: DIT/FT/1B/10

const db = require('./databaseConfig');
const config = require('../config');
const jwt = require('jsonwebtoken');

const StaffDb = {
    login: function (email, password, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            // connection successful
            else {
                const sql = 'select * from staff join address on staff.address_id = address.address_id join city on address.city_id = city.city_id join country on city.country_id = country.country_id where email = ? and password = ?';
                conn.query(sql, [email, password], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return (err, null);
                    }
                    // no error
                    else {
                        // successful login
                        if (result.length == 1) {
                            // create jwt
                            token = jwt.sign({ first_name: result[0].first_name, last_name: result[0].last_name, role: result[0].role }, config.key, {
                                expiresIn: 86400 //expires in 24 hrs
                            });
                            return callback(null, token, result);

                        }
                        // failed login
                        else {
                            var err2 = new Error("UserID/Password does not match.");
                            err2.statusCode = 500;
                            return callback(err2, null, null);
                        }
                    }
                })
            }
        })
    },

    updatePassword: function(email, password, callback){
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            // connection successful
            else {
                const sql = 'update staff set password = ? where email = ?';
                // execute the sql statement
                conn.query(sql, [password, email], function (err, result) {
                    // connection end
                    conn.end();
                    // return error
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        if(result.affectedRows == 0){
                            return callback(null, null);
                        }
                        return callback(null, result);
                    }
                });
            }
        })
    }

}

module.exports = StaffDb

