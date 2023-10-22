let mysql = require('mysql');

/* db connection */
let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "system",
    database: "node_holiday_packages"
})
conn.connect((err) => {
    if (err) {
        console.log(err.message)
    }
    // console.log("db connected");
})

/* db connection (end) */

function updateHotel(req, res) {
    // console.log(req.body)
    let {hotel_id, hotelName, contactNum2, contactNum1, address, city} = req.body
    if (!req.files) {
        let sqlQuery = `UPDATE hotels SET hotel_name='${hotelName}', address='${address}', city=${city}, contactno1='${contactNum1}', contactno2='${contactNum2}' WHERE hotel_id=${hotel_id}`
        conn.query(sqlQuery, (e) => {
            if (e) {
                res.json({errorCode: 1, message: e.message})
            } else {
                res.json({errorCode: 2, message: 'Information updated'})
            }
        })
    } else {
        let {coverPhoto} = req.files
        let serverPath = `public/images/${coverPhoto.name}`
        let dbPath = `images/${coverPhoto.name}`
        coverPhoto.mv(serverPath, (e) => {
            if (e) {
                return res.json({errorCode: 1, message: e.message})
            } else {
                let sqlQuery = `UPDATE hotels SET hotel_name='${hotelName}', address='${address}', city=${city}, coverphoto='${dbPath}', contactno1='${contactNum1}', contactno2='${contactNum2}' WHERE hotel_id=${hotel_id}`
                conn.query(sqlQuery, (e) => {
                    if (e) {
                        res.json({errorCode: 1, message: e.message})
                    } else {
                        res.json({errorCode: 2, message: 'Information updated'})
                    }
                })
            }
        })
    }

}

module.exports = {
    updateHotel
}