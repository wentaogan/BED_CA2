//Name: Gan Wen Tao
// Admission No: p2200378
// Class: DIT/FT/1B/10

const db = require('./databaseConfig');

const storeDb = {
    getAddress: function(callback) {
        // get the db connection
        const conn = db.getConnection();
        // connect to database
        conn.connect(function(err) {
           // connection fail
           if(err) {
               // return error
               return callback(err, null);
           }
           // connectin successful
           else{
               // create a sql query
               const sql = 'select address, district, city, country from address join store on address.address_id = store.address_id join city on address.city_id = city.city_id join country on city.country_id = country.country_id'
               // execute the sql statement
               conn.query(sql, function (err, result) {
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

module.exports = storeDb