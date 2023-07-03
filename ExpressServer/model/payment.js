//Name: Gan Wen Tao
// Admission No: p2200378
// Class: DIT/FT/1B/10

const db = require('./databaseConfig');

const paymentDb = {
    // Additional Endpoint 1: Add new payment 
    addPayment: function (inventory_id, customer_id, return_date, staff_id, amount, callback) {
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
                // create sql statement to insert rental details
                const sql1 = 'insert into rental (inventory_id, customer_id, return_date, staff_id) values (?, ?, ?, ?)';
                // execute the sql statement
                conn.query(sql1, [inventory_id, customer_id, return_date, staff_id], function(err, result){
                    // return error
                    if(err){
                        // end the connection
                        conn.end();
                        console.log(err);
                        return callback(err, null);
                    }
                    else{
                        // create sql statement to insert payment details
                        const sql2 = 'insert into payment(customer_id, staff_id, rental_id, amount) values (?, ?, (select last_insert_id() from rental limit 1), ?)';
                        // execute the sql statement
                        conn.query(sql2, [customer_id, staff_id, amount], function(err, result){
                            // end the connection
                            conn.end();
                            // return error
                            if(err){
                                console.log(err);
                                return callback(err, null);
                            }
                            else{
                                // successful create new payment
                                return callback(null, result);
                            }
                        })
                    }
                })
            }
        })
    }
}

module.exports = paymentDb;