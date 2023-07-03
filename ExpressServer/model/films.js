//Name: Gan Wen Tao
// Admission No: p2200378
// Class: DIT/FT/1B/10

const db = require('./databaseConfig');

const filmsDb = {
    // End Point 6: return the film_id, title, rating, release_year and length of  all films belonging to a category
    getFilms: function (id, callback) {
        // get the db connection
        const conn = db.getConnection();
        // connect to database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                return callback(err, null);
            }
            // connection successful
            else {
                // create a sql query
                const sql = 'select film_id, title, `name` as category, rating, release_year, `length` as duration from film, category where film_id = any (select film_id from film_category where category_id = ?)'
                // execute the sql statement
                conn.query(sql, [id], function (err, result) {
                    // connection end
                    conn.end();
                    // return err
                    if (err) {
                        console.log(err);
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

    // End Point 10 (CA2): return film title, release year and rating
    getFilmsByCategory: function(title, rental, category, callback) {
        const conn = db.getConnection();
        // connect to database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                return callback(err, null);
            }
            // connection successful
            else {
                // create a sql query
                const sql = 'select * from film join film_category on film.film_id = film_category.film_id join category on film_category.category_id = category.category_id where title like ? and rental_rate <= ? and name like ?';
                // execute the sql statement
                conn.query(sql, [title, rental, category], function (err, result) {
                    // connection end
                    conn.end();
                    // return err
                    if (err) {
                        console.log(err);
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

    getFilmDetails: function(title, callback){
        const conn = db.getConnection();
        // connect to database
        conn.connect(function (err) {
            // connection fail
            if (err) {
                return callback(err, null);
            }
            // connection successful
            else {
                // create a sql query
                const sql = 'select film.title, film.description, film.release_year, film.rating, category.name, actor.first_name, actor.last_name from film join film_category on film.film_id = film_category.film_id join category on film_category.category_id = category.category_id join film_actor on film.film_id = film_actor.film_id join actor on film_actor.actor_id = actor.actor_id where film.title = ?'
                // execute the sql statement
                conn.query(sql, [title], function (err, result) {
                    // connection end
                    conn.end();
                    // return err
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    // return data get from database
                    else {
                        return callback(null, result);
                    }
                });
            }
        });
    }
}

module.exports = filmsDb;