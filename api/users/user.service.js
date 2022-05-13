const pool = require("../../config/users_database");

const airline_Pool = require("../../config/airline_database");

module.exports = {

//user registration
newUser: (data, callback)=>{
  pool.query(
    `INSERT INTO users_data (name, email, password)
    VALUES(?,?,?)`,
    [
      data.name,
      data.email,
      data.password
    ],
    (error,results) =>{
      if(error){
        return callback(error);
      }
      return callback(null,results);
    }
  )
},

//for user login 
getUserByEmail:(data,callback)=>{
  pool.query(
    `SELECT * FROM users_data WHERE email=?`,
    [data.email],
    (error, results) => {
      if (error) {

        return callback(error);
      }
      return callback(null, results);
    }

  );
},


  //flight search
  getFlights: (body, callback) => {

    airline_Pool.query(
      `SELECT flightNo,airline,startTime, endDate, endTime, ticketCost FROM flights_data 
      WHERE airlineStatus='ACTIVE' AND startDate=? AND fromPlace=? AND toPlace=?`,
      [
        body.startDate,
        body.fromPlace,
        body.toPlace
      ],
      (error, results) => {
        if (error) {

          return callback(error);
        }
        //console.log(results)
        //results are an array of json objects
        return callback(null, results[0]);
      }
    );
  },

  getReturnFlights: (body, callback) => {

    airline_Pool.query(
      `SELECT flightNo,airline,startDate, startTime, endDate, endTime, ticketCost FROM flights_data 
      WHERE airlineStatus='ACTIVE' AND fromPlace=? AND toPlace=?`,
      [
        body.toPlace,
        body.fromPlace
      ],
      (error, results) => {
        if (error) {

          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },



// user booking flight
bookFlightById:(data, callback)=>{
    pool.query(
      `INSERT into ticketbooking_data(name,email,round_trip, flightNo, passengerDetails, seatNum, meals)
      VALUES(?,?,?,?,?,?,?)`,
      [
        data.name,
        data.email,
        data.round_trip,
        data.flightNo,
        data.passengerDetails,
        data.seatNum,
        data.meals
      ],
      (error, results) => {
        if (error) {

          return callback(error);
        }
        return callback(null, results);
      }
    )
  },

  // bookFlightById: (id, callBack) => {
  //   pool.query(
  //     `SELECT id,firstname,lastname,gender,email,number from registration where id = ?`,
  //     [id],
  //     (error, results, fields) => {
  //       if (error) {
  //         return callBack(error);
  //       }
  //       return callBack(null, results[0]);
  //     }
  //   );
  // },


  

  

 
  
  
}

 