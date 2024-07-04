let express = require("express");
let app = express();
let mysql = require('mysql');
// let mysql2 = require('mysql2');
let path = require('path');
let fileUpload = require('express-fileupload');
let session = require('express-session');


/* CONTROLLERS */
let {updateHotel} = require('./controller/adminController')

/* db connection */
// let conn = mysql2.createConnection({
//     host: "mysql-31067687-vaibhavaggarwal056-9c09.a.aivencloud.com",
//     user: "avnadmin",
//     password: "AVNS_MEcxmr-rbReoCIFyj4t",
//     database: "defaultdb",
//     port: "24387"
// })

let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "system",
    database: "node_holiday_packages"
})

conn.connect((err) => {
    if (err) {
        console.log(err.message)
    }else{
        console.log("connected")
    }
    // return console.log("db connected");
})
/* db connection (end) */

/* session */
app.use(session(
    {
        key: "my_session_id",
        secret: "123ABC@#$",
        resave: false,
        saveUninitialized: false
    }
));
app.use(fileUpload({}));
app.use(express.json()); // for json data...
app.use(express.urlencoded({extended: false})); // post method...
app.use(express.static('public')); // static files...

/* --------------------------- */

app.post('/update-hotel-info', updateHotel)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/index.html"));

})

// app.get("/test", isUserLoggedIn,(req, res) => {
//     res.sendFile(path.join(__dirname + "/html_pages/test.html"));

// })

app.get("/public-header", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/public_header.html"));
})
app.get("/footer", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/footer.html"));
})
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/about.html"));
})
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/contact.html"));
})
app.get("/hotel-list", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/hotel-list.html"));
})

// Admin Module

app.get("/admin-login", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/admin-login.html"));
})

app.post("/admin-login-action", (req, res) => {
    // console.log(req.body);
    let username = req.body.username;
    let pass = req.body.password;
    let selectSQL = "select * from admin where username='" + username + "' and password='" + pass + "'";
    conn.query(selectSQL, (err, row) => {
        if (err)
            res.send(err.message);
        if (row.length > 0) {
            req.session.admin = username;
            res.send("success");
        } else {
            res.send("fail")
        }
    })
})

function isAdminLoggedIn(req, res, next) {
    if (req.session.admin) {
        next();
    } else {
        res.redirect("/admin-login")
    }
}

app.get("/admin-home", isAdminLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/admin/admin-home.html"))
})
app.get("/admin-bookings", isAdminLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/admin/admin-bookings.html"))
})
app.get("/admin-header", isAdminLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/admin/admin-header.html"))
})
app.get("/adm-sess-val", isAdminLoggedIn, (req, res) => {
    res.send(req.session.admin);
})
app.get("/admin-logout", isAdminLoggedIn, (req, res) => {
    req.session.admin = undefined;
    res.redirect("/admin-login")
})
app.get("/admin-change-password", isAdminLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/admin/change-password.html"))
})
app.post("/admin-change-pass-action", isAdminLoggedIn, (req, res) => {
    let username = req.body.username;
    let opass = req.body.opass;
    let npass = req.body.npass;
    let cpass = req.body.cpass;
    // console.log(username,opass,npass,cpass);
    let selectSQL = "select * from admin where username='" + username + "' and password='" + opass + "'";
    conn.query(selectSQL, (err, row) => {
        if (err) {
            res.send(err.message);
        }
        if (row.length > 0) {
            if (npass === cpass) {
                let updateSQL = "update admin set password='" + npass + "' where username='" + username + "'";
                conn.query(updateSQL, (e) => {
                    if (e)
                        res.send(e);
                    res.send("updated");
                })
            }
        } else {
            res.send("old not");
        }
    })
})

app.get("/cities", isAdminLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/admin/manage-cities.html"))
})
app.post("/add-city", isAdminLoggedIn, (req, res) => {
    // console.log(req.body);
    let state = req.body.state;
    let city = (req.body.city).toLowerCase();
    let pin_code = req.body.pin_code;
    let selectSQL = "select * from city where name='" + city + "'";
    conn.query(selectSQL, (err, row) => {
        if (err)
            res.send(err.message);
        if (row.length > 0) {
            res.send("exists");
        } else {
            let insertSQL = "insert into city values(null,'" + city + "','" + pin_code + "','" + state + "')";
            conn.query(insertSQL, (e) => {
                if (e)
                    res.send(e.message);
                res.send("inserted");
            })
        }
    })
})

app.get("/get-cities", (req, res) => {
    let selectSQL = "select * from city order by city_id desc";
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            res.send(err.message);
        } else {
            res.send(rows);
        }
    })
})

app.get("/del-city/:city_id", (req, res) => {
    let city_id = req.params.city_id;

    let delSQL = "delete from city where city_id=" + city_id;
    conn.query(delSQL, (err) => {
        if (err) {
            res.send(err.message);
        }
        res.send("deleted");
    })
})


app.post("/up-city", (req, res) => {
    console.log(req.body);
    let cityid = req.body.cityid;
    let state = req.body.state;
    let name = req.body.city;
    let pincode = req.body.pin_code;
    let updateSQL = "update city set name='" + name + "',pincode='" + pincode + "',state='" + state + "' where city_id=" + cityid;
    conn.query(updateSQL, (err) => {
        if (err)
            res.send(err.message);
        res.send("updated");
    })

})

//hotel & gallery
app.get("/hotels", isAdminLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/admin/manage-hotels.html"));
})

app.get("/get-states", (req, res) => {
    let select = "select distinct state from city";
    conn.query(select, (err, rows) => {
        if (err)
            res.send(err.message);
        res.send(rows);
    })
})

app.get("/get-cities-statewise/:state", (req, res) => {
    let state = req.params.state;
    let citySQL = "select * from city where state='" + state + "'";
    console.log(citySQL)
    conn.query(citySQL, (err, rows) => {
        if (err) {
            res.send(err.message);
        }
        res.send(rows);
    })
})

app.post("/add-hotel", (req, res) => {
    // console.log(req.body);
    let hotel_name = (req.body.hotel_name).toLowerCase();
    let city = req.body.city;
    let address = req.body.address;
    let cphoto = req.files.cphoto;
    let cno1 = req.body.cno1;
    let cno2 = req.body.cno2;
    let select = "select * from hotels where hotel_name='" + hotel_name + "' and city =" + city;
    console.log(select);
    conn.query(select, (err, row) => {
        if (err) {
            res.send(err.message);
        }
        if (row.length > 0) {
            res.send("exists");
        } else {
            let dbpath = "images/" + cphoto.name;
            let realpath = "public/images/" + cphoto.name;
            cphoto.mv(realpath, (e) => {
                if (e)
                    res.send(e.message);
            })
            let insertSQL = "insert into hotels values(null,'" + hotel_name + "','" + address + "'," + city + ",'" + dbpath + "','" + cno1 + "','" + cno2 + "','active')";
            console.log(insertSQL);
            conn.query(insertSQL, (er) => {
                if (er)
                    res.send(er.message);
                res.send("inserted")
            })
        }
    })
    // res.send("done");
})

app.get("/get-hotels", (req, res) => {
    let select = "Select * from hotels inner join city on hotels.city=city.city_id order by hotel_id desc";
    conn.query(select, (err, rows) => {
        if (err)
            res.send(err.message);
        res.send(rows);
    })
})

app.get("/delete-hotel/:id", (req, res) => {
    let hid = req.params.id;
    let delSQL = `Delete from hotels where hotel_id=${hid}`;
    conn.query(delSQL, (err) => {
        if (err) {
            return res.send(err.message);
        }
        res.send("deleted")
    })
})

app.post("/add-hotel-photo", (req, res) => {
    let hid = req.body.hid;
    let title = req.body.title;
    let photo = req.files.pic;
    let realpath = "public/images/" + photo.name;
    let dbpath = "/images/" + photo.name;
    photo.mv(realpath, (err) => {
        if (err)
            res.send(err.message)
    })
    let insert = "insert into hotel_gallery values(null,'" + title + "','" + dbpath + "'," + hid + ")";
    conn.query(insert, (err) => {
        if (err)
            res.send(err.message)
        res.send("inserted")
    })
})


app.get("/view-hphotos/:hid", (req, res) => {
    let hid = req.params.hid;
    let select = "select * from hotel_gallery where hotel=" + hid;
    conn.query(select, (err, rows) => {
        if (err)
            res.send(err.message);
        res.send(rows);
    })
})

app.get("/del-photo/:pid", (req, res) => {
    let photoid = req.params.pid;
    let delSQL = "delete from hotel_gallery where hg_id=" + photoid;
    conn.query(delSQL, (err) => {
        if (err)
            res.send(err.message);
        res.send("deleted");
    })
})

// Accommodations
app.get("/accommodations", isAdminLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/admin/manage-accommodations.html"));
})
app.post("/add-accommodation", (req, res) => {
    console.log(req.body);
    let hotel_id = req.body.hotel_name;
    let free_wifi = req.body.free_wifi;
    let free_parking = req.body.free_park;
    let restaurant = req.body.restaurant;
    let two4hour_roomservice = req.body.two4hour_roomservice;
    let breakfast = req.body.breakfast;
    let extra_bedding = req.body.extra_bedding;
    let minibar = req.body.minibar;
    let air_conditioner = req.body.air_conditioner;
    let selectSQL = "select * from accommodations where hotel=" + hotel_id;
    conn.query(selectSQL, (err, row) => {
        if (err)
            res.send(err.message);
        if (row.length > 0) {
            res.send("exists");
        } else {
            let insertSQL = "insert into accommodations values(null," + hotel_id + "," + free_wifi + "," + free_parking + "," + restaurant + "," + two4hour_roomservice + "," + breakfast + "," + extra_bedding + "," + minibar + "," + air_conditioner + ")";
            console.log(insertSQL);
            conn.query(insertSQL, (err) => {
                if (err)
                    res.send(err.message);
                res.send("inserted")
            })
        }
    })
})

app.post("/update-accommodation", (req, res) => {
    let acc_id = req.body.acc_id;
    let free_wifi = req.body.ufree_wifi;
    let free_parking = req.body.ufree_park;
    let restaurant = req.body.urestaurant;
    let two4hour_roomservice = req.body.utwo4hour_roomservice;
    let breakfast = req.body.ubreakfast;
    let extra_bedding = req.body.uextra_bedding;
    let minibar = req.body.uminibar;
    let air_conditioner = req.body.uair_conditioner;
    let upSQL = "update accommodations set free_wifi=" + free_wifi + ",free_parking=" + free_parking + ",restaurant=" + restaurant +",two4hour_roomservice=" + two4hour_roomservice +",breakfast=" + breakfast +",extra_bedding=" + extra_bedding +",minibar=" + minibar + ",air_conditioned=" + air_conditioner + " where acc_id=" + acc_id;
    console.log(upSQL)
    conn.query(upSQL, (err) => {
        if(err) return res.send(err.message);
        res.send("updated");
    })
})

app.get("/get-accommodations", (req, res) => {
    let acc = "select * from accommodations inner join hotels on hotels.hotel_id = accommodations.hotel";
    conn.query(acc, (err, rows) => {
        if (err)
            res.send(err.message);
        res.send(rows);
    })
})
app.get("/del-accommodation/:id", (req, res) => {
    let id = req.params.id;
    let delSQL = "delete from accommodations where acc_id = " + id;
    console.log(delSQL)
    conn.query(delSQL, (err) => {
        if (err)
            res.send(err.message);
        res.send("deleted")
    })
})

// Packages
app.get("/packages", isAdminLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/admin/manage-packages.html"))
})

app.post("/add-package", (req, res) => {
    console.log(req.body);
    let hotel = req.body.hotel_id;
    let gold = req.body.gold;
    let silver = req.body.silver;
    let platinum = req.body.platinum;
    let selectSQL = "select * from packages where hotel_id=" + hotel;
    conn.query(selectSQL, (err, row) => {
        if (err) {
            res.send(err.message)
        }
        if (row.length > 0) {
            res.send("exists");
        } else {
            let insertSQL = "insert into packages values(null," + hotel + "," + gold + "," + silver + "," + platinum + ")";
            console.log(insertSQL)
            conn.query(insertSQL, (e) => {
                if (e)
                    res.send(e.message);
                res.send("inserted");
            })
        }
    })
})
app.get("/get-packages", (req, res) => {
    let selectSQL = "select * from packages inner join hotels on packages.hotel_id = hotels.hotel_id";
    conn.query(selectSQL, (err, rows) => {
        if (err)
            res.send(err.message);
        res.send(rows);
    })
})

app.get("/del-package/:packid", (req, res) => {
    var pckid = req.params.packid;
    let delSQL = "delete from packages where pck_id=" + pckid;
    conn.query(delSQL, (err) => {
        if (err)
            res.send(err.message);
        res.send("deleted")
    })
})

app.post("/update-package", (req, res) => {
    console.log(req.body);
    let pck_id = req.body.pck_id;
    let gold = req.body.gold;
    let silver = req.body.silver;
    let platinum = req.body.platinum;
    let upSQL = "update packages set gold=" + gold + ",silver=" + silver + ",platinum= " + platinum + " where pck_id=" + pck_id;
    console.log(upSQL)
    conn.query(upSQL, (err) => {
        if (err)
            res.send(err.message);
        res.send("updated");
    })
})
//user
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/signup.html"))

})

app.post("/signup-action", async (req, res) => {
    console.log(req.body);
    let email = req.body.email;
    let fname = req.body.fname;
    let pass = req.body.pass;
    let phone = req.body.phone;
    let gender = req.body.gender;
    let select = "select * from users where user_email = '" + email + "'";
    conn.query(select, (err, row) => {
        if (err)
            res.send(err.message);
        if (row.length > 0) {
            res.send("exists");
        } else {
            let insertSQL = "insert into users values('" + email + "', '" + fname + "','" + gender + "','" + phone + "','" + pass + "')";
            console.log(insertSQL);
            conn.query(insertSQL, async (e) => {
                if (e) {

                    res.send(e.message);
                } else {

                    res.send("inserted");
                }
            })
        }
    })     
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/login.html"));
})
app.post("/user-login-action", (req, res) => {
    //console.log(req.body);
    let email = req.body.email;
    let pass = req.body.password;
    let selectSQL = "select * from users where user_email = '" + email + "' and password='" + pass + "'";
    console.log(selectSQL);
    conn.query(selectSQL, (err, row) => {
        if (err) {
            res.send(err.message);
        }
        if (row.length > 0) {
            req.session.userSession = email;
            res.send("success");
        } else {
            res.send("invalid");
        }
    })
})

function isUserLoggedIn(req, res, next) {
    if (req.session.userSession) {
        next();
    } else {
        res.redirect("/login")
    }
}

app.get("/user-header", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/users/user-header.html"))

})
app.get("/user-home", isUserLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/users/user_home.html"))
})
app.get("/book-now", isUserLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/users/booking.html"))
})
app.get("/user-sess-val", isUserLoggedIn, (req, res) => {
    res.send(req.session.userSession);
})
app.get("/user-logout", (req, res) => {
    req.session.userSession = undefined;
    res.redirect("/login")
})
app.get("/get-hotel-packages", (req, res) => {
    let selectSQL = "select * from hotels inner join packages on hotels.hotel_id=packages.hotel_id inner join city on hotels.city = city.city_id";
    conn.query(selectSQL, (err, rows) => {
        if (err)
            res.send(err.message)
        if (rows.length > 0) {
            res.send(rows);
        } else
            res.send({output: "no data"});
    })
})

function getAccommodations(rows) {
    return new Promise((resolve, reject) => {
        let counter = 0;
        for (let i = 0; i < rows.length; i++) {
            let accom = `SELECT * FROM accommodations WHERE hotel=${rows[i].hotel_id}`
            conn.query(accom, (e, accomRows) => {
                if (e) return reject(e.message)
                rows[i]['accommodations'] = accomRows
                counter++
                if (counter === rows.length) {
                    resolve(rows)
                }
            })
        }
    })
}

app.get("/get-hotel-packages-2", (req, res) => {
    let selectSQL = "select * from hotels Inner Join packages on hotels.hotel_id=packages.hotel_id Inner Join city on hotels.city=city.city_id";
    conn.query(selectSQL, async (err, rows) => {
        if (err) {
            return res.json({error: true, message: err.message, rows: []})
        }
        await getAccommodations(rows)
        res.json({error: false, message: '', rows: rows})
    })
})

app.get("/book_package/:packid/:pack_type/:net_amt", (req, res) => {
    // console.log(req.params);
    let packid = req.params.packid;
    let packtype = req.params.pack_type;
    var net_amt = req.params.net_amt;
    let dt = new Date();
    let tyear = dt.getFullYear();
    var tmon = dt.getMonth() + 1;
    var tday = dt.getDate();
    let tdate = tyear + "-" + tmon + "-" + tday;
    let endyear = dt.getFullYear() + 1;
    let endate = endyear + "-" + tmon + "-" + tday;
    let select = "select * from booking where user = '" + req.session.userSession + "' and pack=" + packid + " and pack_type='" + packtype + "' and date_format(end_date,'%d/%m/%y %T') <= now()";
    console.log("Booking Already Exists");
    console.log(select);
    conn.query(select, (err, row) => {
        if (err) {
            res.send(err.message)
        }

        if (row.length > 0) {
            res.send("exists");
        } else {
            let insert = "insert into booking values(null,'" + req.session.userSession + "'," + packid + ",'" + packtype + "','" + tdate + "','" + endate + "'," + net_amt + ",'paid')";
            // console.log(insert);
            conn.query(insert, (er) => {
                if (er) {
                    return res.send(er.message)
                }
                res.send("booked")
            })
        }
    })
})

app.get("/booking-confirmation", (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/users/booking-confirmation.html"))
})
app.get("/user-bookings", isUserLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/users/user-bookings.html"))

})

app.get("/fetch-all-bookings", (req, res) => {
    let selectSQL = "select date_format(booking_date, '%d-%M-%Y') as book_date, date_format(end_date, '%d-%M-%Y') as e_date, hotels.*, booking.status as bookstatus, booking.total_amount as book_amt, booking.pack_type from booking inner join packages on booking.pack = packages.pck_id inner join hotels on hotels.hotel_id=packages.hotel_id";
    // console.log(selectSQL);
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            return res.json({error: true, message: err.message, rows: []})
        }
        return res.json({error: false, message: '', rows: rows})
    })
})

app.get("/fetch-my-bookings", isUserLoggedIn, (req, res) => {
    let selectSQL = "select date_format(booking_date, '%d-%M-%Y') as book_date, date_format(end_date, '%d-%M-%Y') as e_date, hotels.*, booking.status as bookstatus, booking.total_amount as book_amt, booking.pack_type from booking inner join packages on booking.pack = packages.pck_id inner join hotels on hotels.hotel_id=packages.hotel_id where user='" + req.session.userSession + "'";
    console.log(selectSQL);
    conn.query(selectSQL, (err, rows) => {
        if (err)
            res.send(err.message);
        res.send(rows);
    })
})

app.get("/user-change-password", isUserLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + "/html_pages/users/change_password.html"))
})
app.post("/user-change-password-action", (req, res) => {
    let email = req.body.email;
    let opass = req.body.opass;
    let npass = req.body.npass;
    let cpass = req.body.cpass;
    // console.log(username,opass,npass,cpass);
    let selectSQL = "select * from users where user_email='" + email + "' and password='" + opass + "'";
    conn.query(selectSQL, (err, row) => {
        if (err) {
            res.send(err.message);
        }
        if (row.length > 0) {
            if (npass === cpass) {
                let updateSQL = "update users set password='" + npass + "' where user_email='" + email + "'";
                conn.query(updateSQL, (e) => {
                    if (e)
                        res.send(e);
                    res.send("updated");
                })
            }
        } else {
            res.send("old not");
        }
    })
})

app.get('*', (req, res) => {
    res.json({
        status: "404",
        message: "Page not found!"
    })
})
let port = 3000;
app.listen(port, () => {
    console.log("Server running at port " + port);
})