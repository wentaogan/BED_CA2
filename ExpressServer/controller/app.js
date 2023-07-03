// Name: Gan Wen Tao
// Admission No: p2200378
// Class: DIT/FT/1B/10

const express = require('express');
const actor = require('../model/actor');
const customer = require('../model/customer');
const films = require('../model/films');
const payment = require('../model/payment');
const staff = require('../model/staff');
const verify = require('../auth/verifyFn');
const comments = require('../model/comment');
const category = require('../model/category');
const store = require('../model/store');
const city = require('../model/city')

var cors = require('cors');


// create web server 
const app = express();
app.options('*', cors());
app.use(cors());
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
// parse application/json
app.use(bodyParser.json());
// parse application /x-www-form-urlencoded
app.use(urlencodedParser);

// check whether a string only contain alphabet
function checkStr(str) {
    let check = /^[a-zA-Z]+$/;
    return check.test(str);
}

// check whether email is valid
function checkEmail(str) {
    let check = /^[a-zA-Z0-9\_]+(?:\.[a-zA-Z0-9\_]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
    return check.test(str);
}

// check whether date is valid
function checkDate(str) {
    let check = /((((19|20)([2468][048]|[13579][26]|0[48])|2000)-02-29|((19|20)[0-9]{2}-(0[4678]|1[02])-(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}-(0[1359]|11)-(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}-02-(0[1-9]|1[0-9]|2[0-8])))\s([01][0-9]|2[0-3]):([012345][0-9]):([012345][0-9]))/;
    return check.test(str);
}

// check phone number only contain number and -
function checkPhone(phone) {
    let check = /^[0-9\-]+$/;
    return check.test(phone);
}

// check store_id only contain 1 and 2
function checkStore_id(store_id) {
    let check = /^[1-2]{1}$/;
    return check.test(store_id);
}


// Endpoint 1: handle get request to a specific actor record
app.get('/actors/:actor_id', function (req, res) {
    const id = req.params.actor_id;
    actor.getActor(id, function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // no content
        else if (!result) {
            res.status(204)
        }
        // ok response and send result
        else {
            res.send(result);
        }
    });
});


// Endpoint 2: handle get request to get all the actors
app.get('/actors', function (req, res) {
    // set default limit rows as 20
    const limit = parseInt(req.query.limit || 20);
    // set default offset as 0
    const offset = parseInt(req.query.offset || 0);
    actor.getActors(limit, offset, function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // ok response and send result
        else {
            res.send(result);
        }
    })
});


// Endpoint 3: handle post request to add a actor record
app.post('/actors', verify.verifyToken, verify.verifyAdmin, function (req, res) {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    // check input is not empty 
    if ((first_name == undefined || first_name == "") || (last_name == undefined || last_name == "")) {
        // return missing data message
        return res.status(400).send({ "error_msg": "missing data" });
    }
    // check input only contain alphabet
    else if (!checkStr(first_name) || !checkStr(last_name)) {
        // return missing invalid data message
        return res.status(400).send({ "error_msg": "invalid data" });
    }
    else {
        actor.addActor(first_name, last_name, function (err, result) {
            // ok response and send result
            if (!err) {
                return res.status(201).send({ "actor_id": result.insertId + '' });
            }
            // internal server error
            else {
                return res.status(500).send({ "error_msg": "Internal server error" });
            }
        });
    }
});


// Endpoint4: handle put request to update actor's first_name or last_name or both
app.put('/actors/:actor_id', function (req, res) {
    const id = req.params.actor_id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    let data = {};
    // check input is not empty
    if ((first_name == undefined || first_name == "") && (last_name == undefined || last_name == "")) {
        // return missing data message
        return res.status(400).send({ "error_msg": "missing data" });
    }
    // update last_name
    else {
        if ((first_name == undefined || first_name == "") && (last_name != undefined || last_name != "")) {
            // check input only contain alphabet
            if (!checkStr(last_name)) {
                // return invalid data message
                return res.status(400).send({ "error_msg": "invalid data" });
            }
            data = {
                sql: 'update actor set last_name = ? where actor_id = ?',
                update_data: [last_name, id],
            }
        }
        // update first_name
        else if ((first_name != undefined || first_name != "") && (last_name == undefined || last_name == "")) {
            // check input only contain alphabet
            if (!checkStr(first_name)) {
                // return invalid data message
                return res.status(400).send({ "error_msg": "invalid data" });
            }
            data = {
                sql: 'update actor set first_name = ? where actor_id = ?',
                update_data: [first_name, id],
            }
        }
        // update first_name and last_name
        else {
            // check input only contain alphabet
            if (!checkStr(first_name) || !checkStr(last_name)) {
                // return invalid data message
                return res.status(400).send({ "error_msg": "invalid data" });
            }
            data = {
                sql: 'update actor set first_name = ?, last_name = ? where actor_id = ?',
                update_data: [first_name, last_name, id]
            }
        }
    }
    actor.updateActor(data, function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // actor_id not found, no content
        else if (!result) {
            res.status(204).send();
        }
        // ok response and send record update success message
        else {
            res.send({ "success_msg": "record updated" });
        }
    });
});


// Endpoint 5: handle delete request to delete a actor
app.delete('/actors/:actor_id', function (req, res) {
    const id = req.params.actor_id;
    actor.deleteActor(id, function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // actor_id not found, no content
        else if (!result) {
            res.status(204).send()
        }
        // ok response successful deleted
        else {
            res.send({ "success_msg": "actor deleted" });
        }
    });
});


// End Point 6: return the film_id, title, rating, release_year and length of  all films belonging to a category
app.get('/film_categories/:category_id/films', function (req, res) {
    const id = req.params.category_id;
    films.getFilms(id, function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // ok response and send result
        else {
            res.send(result);
        }
    });
});


// End Point 7: return the payment detail of a customer between the provided period.
app.get('/customer/:customer_id/payment', function (req, res) {
    let sum = 0;
    const id = req.params.customer_id;
    // create date object from a date string
    const start_date = new Date(req.query.start_date + '');
    const end_date = new Date(req.query.end_date + '');
    customer.getPayment(id, start_date, end_date, function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // ok response and send data
        else {
            // calculate total
            result.forEach((v) => {
                sum += v.amount;
            });
            // generate payment_date in yyyy-mm-dd hh:mm:ss
            result.forEach((v) => {
                v.payment_date = v.payment_date.getUTCFullYear() + "-" +
                    ("0" + (v.payment_date.getUTCMonth() + 1)).slice(-2) + "-" +
                    ("0" + v.payment_date.getUTCDate()).slice(-2) + " " +
                    ("0" + v.payment_date.getUTCHours()).slice(-2) + ":" +
                    ("0" + v.payment_date.getUTCMinutes()).slice(-2) + ":" +
                    ("0" + v.payment_date.getUTCSeconds()).slice(-2);;
            });
            res.send({ "rental": result, "total": Math.round(sum * 100) / 100 + '' });
        }
    });
});


// End Point 8: add a new customer to the database
app.post('/customers', verify.verifyToken, verify.verifyAdmin, function (req, res) {
    const customerDetail = {
        store_id: req.body.store_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    }
    const addressDetail = {
        address_line1: req.body.address_line1,
        address_line2: req.body.address_line2 || null,
        district: req.body.district,
        city: req.body.city,
        postal_code: req.body.postal_code,
        phone: req.body.phone
    }
    // validate user input

    if ((customerDetail.store_id == undefined || customerDetail.store_id == "")) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if (!checkStore_id(customerDetail.store_id)) {
        return res.status(400).send({ "error_msg": "invalid data" });
    }

    if ((customerDetail.email == undefined || customerDetail.email == "")) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if (!checkEmail(customerDetail.email)) {
        return res.status(400).send({ "error_msg": "invalid data" });
    }

    if ((addressDetail.address_line1 == undefined || addressDetail.address_line1 == "")) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if ((addressDetail.district == undefined || addressDetail.district == "")) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if ((addressDetail.postal_code == undefined || addressDetail.postal_code == "")) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if (isNaN(addressDetail.postal_code)) {
        return res.status(400).send({ "error_msg": "invalid data" });
    }

    if ((addressDetail.phone == undefined || addressDetail.phone == "")) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if (!checkPhone(addressDetail.phone)) {
        return res.status(400).send({ "error_msg": "invalid data" });
    }

    customer.addCustomer(customerDetail, addressDetail, function (err, result) {
        // internal server error
        if (err) {
            console.log(err);
            return res.status(500).send({ "error_msg": "Internal server error" });
        }
        else {
            if (result.affectedRows) {
                // successful create new customer
                return res.status(201).send({ "customer_id": result.insertId + '' });
            }
            else {
                // email already exist
                return res.status(409).send({ "error_msg": "email already exists" });
            }
        }
    });
}
);


// Additional Endpoint 1: Add new payment 
app.post('/payment', function (req, res) {
    const inventory_id = req.body.inventory_id;
    const customer_id = req.body.customer_id;
    const return_date = req.body.return_date;
    const staff_id = req.body.staff_id;
    const amount = req.body.amount;

    // validate user input
    if (return_date == "" || return_date == undefined) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if (!checkDate(return_date)) {
        console.log(return_date)
        return res.status(400).send({ "error_msg": "invalid data" });
    }

    if (inventory_id == "" || inventory_id == undefined) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if (isNaN(inventory_id)) {
        return res.status(400).send({ "error_msg": "invalid data" });
    }

    if (customer_id == "" || customer_id == undefined) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if (isNaN(customer_id)) {
        return res.status(400).send({ "error_msg": "invalid data" });
    }

    if (staff_id == "" || staff_id == undefined) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if (!checkStore_id(staff_id)) {
        return res.status(400).send({ "error_msg": "invalid data" });
    }

    if (amount == "" || amount == undefined) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if (isNaN(amount)) {
        return res.status(400).send({ "error_msg": "invalid data" });
    }

    payment.addPayment(inventory_id, customer_id, return_date, staff_id, amount, function (err, result) {
        // internal server error
        if (err) {
            console.log(err);
            return res.status(500).send({ "error_msg": "Internal server error" });
        }
        // ok response and send result
        else {
            if (result.affectedRows) {
                return res.status(201).send({ "payment_id": result.insertId + '' })
            }
        }
    });
})


// Additional Endpoint 2: update customer phone number
app.put('/customers/:customer_id/address', function (req, res) {
    const id = req.params.customer_id;
    const phone = req.body.phone;
    // validate phone number 
    if ((phone == undefined || phone == "")) {
        return res.status(400).send({ "error_msg": "missing data" });
    }

    if (!checkPhone(phone)) {
        return res.status(400).send({ "error_msg": "invalid data" });
    }

    customer.updatePhone(id, phone, function (err, result) {
        // internal server error
        if (err) {
            console.log(err);
            return res.status(500).send({ "error_msg": "Internal server error" });
        }
        // customer_id not found, no content
        else if (!result) {
            res.status(204).send();
        }
        // ok response and send record update successfully
        else {
            res.send({ "success_msg": "record updated" });
        }
    });
})




// End Point 9 (CA2): get all category of film
app.get('/film/category', function (req, res) {
    category.getCategory(function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // ok response and send result
        else {
            res.send(result);
        }
    })
})

// End Point 10 (CA2): return all film title, release year and rating after press search button
app.get('/films/:title&:rental&:category', function (req, res) {
    const title = (req.params.title === "false") ? "%" : "%" + req.params.title + "%";
    const rental = parseFloat(req.params.rental);
    const category = (req.params.category === "false") ? "%" : req.params.category;
    console.log(title);
    console.log(rental);
    console.log(category);
    films.getFilmsByCategory(title, rental, category, function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // ok response and send result
        else {
            res.send(result);
        }
    });
});

// End Point 11 (CA2): get film details
app.get('/film/details/:title', function (req, res) {
    const title = req.params.title;
    films.getFilmDetails(title, function (err, result) {
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        else {
            res.send(result);
        }
    })
});

// End Point 12 (CA2): get film comment details
app.get('/film/comment/:title', function (req, res) {
    const title = req.params.title;
    comments.getComment(title, function (err, result) {
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        else {
            res.send(result);
        }
    })
});

// End Point 13 (CA2): insert comments
app.post('/film/comment/:title', function (req, res) {
    const title = req.params.title;
    const name = req.body.name;
    const comment = req.body.comment;
    const score = req.body.score;
    comments.addComment(name, comment, score, title, function (err, result) {
        if (!err) {
            return res.status(201).send({ "comment_id": result.insertId + '' });
        }
        else {
            return res.status(500).send({ "error_msg": "Internal server error" })
        }
    })
});

// End Point 14 (CA2): get store address
app.get('/store/address', function (req, res) {

    store.getAddress(function (err, result) {
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        else {
            res.send(result);
        }
    })
});

// End Point 15 (CA2): handle admin post login request
app.post('/staff/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    staff.login(email, password, function (err, token, result) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            delete result[0]['password'];//clear the password in json data, do not send back to client
            console.log(result);
            res.json({ success: true, UserData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });
            res.send();
        }
    })

})


// End Point 16 (CA2): get all city name
app.get('/city', function (req, res) {
   city.getAllCity(function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // ok response and send result
        else {
            res.send(result);
        }
    })
});

// End Point 17 (CA2): handle customer post login request
app.post('/customer/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    customer.login(email, password, function (err, token, result) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            delete result[0]['password'];//clear the password in json data, do not send back to client
            console.log(result);
            res.json({ success: true, UserData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });
            res.send();
        }
    })

})

// End Point 18 (CA2): reset customer password
app.put('/customer/:email', function (req, res) {
    const email = req.params.email;
    const pwd = req.body.password;
    customer.updatePassword(email, pwd, function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // actor_id not found, no content
        else if (!result) {
            res.status(204).send();
        }
        // ok response and send record update success message
        else {
            res.send({ "success_msg": "record updated" });
        }
    });
});

// End Point 19 (CA2): reset staff password
app.put('/staff/:email', function (req, res) {
    const email = req.params.email;
    const pwd = req.body.password;
    staff.updatePassword(email, pwd, function (err, result) {
        // internal server error
        if (err) {
            res.status(500).send({ "error_msg": "Internal server error" });
        }
        // actor_id not found, no content
        else if (!result) {
            res.status(204).send();
        }
        // ok response and send record update success message
        else {
            res.send({ "success_msg": "record updated" });
        }
    });
});

module.exports = app;