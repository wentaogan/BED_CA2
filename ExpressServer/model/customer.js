//Name: Gan Wen Tao
// Admission No: p2200378
// Class: DIT/FT/1B/10

const db = require('./databaseConfig');
const config = require('../config');
const jwt = require('jsonwebtoken');


const customerDb = {
    // End Point 7: return the payment detail of a customer between the provided period.
    getPayment: function (id, start_date, end_date, callback) {
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
                const sql = 'select film.title, payment.amount, payment.payment_date from payment join rental on payment.rental_id = rental.rental_id join inventory on inventory.inventory_id = rental.inventory_id join film on film.film_id = inventory.film_id where payment.customer_id = ? and payment.payment_date between ? and ?';
                // execute the sql statement
                conn.query(sql, [id, start_date, end_date], function (err, result) {
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

    // End Point 8: add a new customer to the database 
    addCustomer: function (customerDetail, addressDetail, callback) {
        // get the db connection
        const conn = db.getConnection();
        // connection to database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                console.log('connection failed');
                console.log(err);
                return callback(err, null);
            }
            // connection successful
            else {
                console.log('connected');
                // create sql statement to check email exist or not
                const sql1 = 'select customer.customer_id from customer where customer.email = ?';
                // execute the sql statement
                conn.query(sql1, [customerDetail.email], function (err, result) {
                    // return error
                    if (err) {
                        // connection end
                        conn.end();
                        console.log(err);
                        return callback(err, null);
                    }
                    else if (result.length == 0) {
                        // create sql statement to insert customer address details
                        const sql2 = 'insert into address(address, address2, district, city_id, postal_code, phone) values (?, ?, ?, (select city_id from city where city = ?), ?, ?)';
                        // execute the sql statement
                        conn.query(sql2, [addressDetail.address_line1, addressDetail.address_line2, addressDetail.district, addressDetail.city, addressDetail.postal_code, addressDetail.phone], function (err, result) {
                            if (err) {
                                // return error
                                console.log(err);
                                return callback(err, null);
                            }
                            else {
                                // create sql statement to insert customer details
                                const sql3 = 'insert into customer(store_id, first_name, last_name, email, address_id) values (?, ?, ?, ?, (select last_insert_id() from address limit 1))';
                                // execute the sql statement
                                conn.query(sql3, [customerDetail.store_id, customerDetail.first_name, customerDetail.last_name, customerDetail.email], function (err, result) {
                                    // end the connection
                                    conn.end();
                                    if (err) {
                                        // return error
                                        console.log(err);
                                        return callback(err, null);
                                    }
                                    else {
                                        // successful create new customer
                                        return callback(null, result);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        // end the connection
                        conn.end();
                        // return the email already exist
                        console.log(result);
                        return callback(null, result);
                    }
                });
            }
        });
    },

    // Additional Endpoint 2: update customer phone number
    updatePhone: function (id, phone, callback) {
        // get the db connection
        const conn = db.getConnection();
        // connect to the database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                console.log('connection failed');
                return callback(err, null);
            }
            // connection successful
            else {
                console.log('connected');
                // create a sql statement
                const sql2 = 'update  address set phone = ? where address_id = (select address_id from customer where customer_id = ?)';
                // execute the sql statement
                conn.query(sql2, [phone, id], function (err, result) {
                    // connection end
                    conn.end();
                    if (err) {
                        // return error
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        // actor_id not found in database
                        if (result.affectedRows == 0) {
                            return callback(null, null);
                        }
                        else {
                            // successful update phone record
                            return callback(null, result);
                        }
                    }
                });

            }
        })
    },

    login: function (email, password, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            // connection successful
            else {
                const sql = 'select * from customer join address on customer.address_id = address.address_id join city on address.city_id = city.city_id where email = ? and password = ? ';
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
                const sql = 'update customer set password = ? where email = ?';
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

module.exports = customerDb;