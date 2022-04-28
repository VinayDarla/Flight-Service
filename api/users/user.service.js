const pool = require("../../config/database");

module.exports = {
  create: (data, callback) => {
    pool.query(
      `INSERT INTO REGISTRATION(id,firstname, lastname, gender, email, password, number)
            values(?,?,?,?,?,?,?)`,
      [
        data.id,
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.password,
        data.number,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getUsers: (callBack) => {
    pool.query(
      `SELECT id,firstname,lastname,gender,email,number from registration`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserById: (id, callBack) => {
    pool.query(
      `SELECT id,firstname,lastname,gender,email,number from registration where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};
