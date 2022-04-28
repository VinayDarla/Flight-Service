const pool = require("../../config/database");

module.exports = {
    create:(data, callback) => {
        pool.query(
            `INSERT INTO REGISTRATION(firstname, lastname, gender, email, password, number)
            values(?,?,?,?,?,?)`,
            [
                data.first_name,
                data.last_name,
                data.gender,
                data.email,
                data.password,
                data.number
            ],
            ( error, results, fields) => {
                if(error) {
                  return callback(error)
                }
                return callback(null, results)

            }
        );

    }
}