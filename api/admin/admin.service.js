//importing Admin database file
const admin_pool = require("../../config/admin_database");

//importing Airline database file
const pool = require('../../config/airline_database');

module.exports = {

  //admin creation method
  createAdmin: (data, callback) => {
    admin_pool.query(
      `INSERT INTO admin_data(id,name, email, password)
            values(?,?,?,?)`,
      [
        data.id,
        data.name,
        data.email,
        data.password,
      ],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //admin login
  getAdminByEmail: (email, callBack) => {
    admin_pool.query(
      `SELECT * FROM admin_data WHERE email = ?`,
      [email],
      (error, results) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  

  // add airline
  airlineRegister: (data,callback) =>{
    pool.query(
      `INSERT into airlines_data(id, airlineName,status)
      VALUES(?,?,?)`,
      [
        data.id,
        data.airlineName,
        data.status
      ],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    )
  },

    //block an airline
  airlineBlock: (data, callback) =>{
    pool.query (
      `UPDATE airlines_data set status=? where airlineName=?`,
      [data.status, data.airlineName],
      (error, results, status) => {
        if (error) {
          return callback(error);
        }
        status = data.status;
        //console.log("line 76",results);
        //since it is "patch" request we have to check affected rows 
        return callback(null, results, status);
      }
    
    )
  },


  //adding flight details
  addFlight: (data, callback) =>{
    
    pool.query(
      `INSERT into flights_data(flightNo, airline, airlineStatus,fromPlace, toPlace, startDate, startTime, endDate, endTime, 
        scheduledDays, instrumentUsed, premiumSeats, nonPremiumSeats, ticketCost, numOfRows, meals)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          data.flightNo,
          data.airline,
          data.airlineStatus,
          data.fromPlace,
          data.toPlace,
          data.startDate,
          data.startTime,
          data.endDate,
          data.endTime,
          data.scheduledDays,
          data.instrumentUsed,
          data.premiumSeats,
          data.nonPremiumSeats,
          data.ticketCost,
          data.numOfRows,
          data.meals
        ],
        (error, results) => {
          if (error) {
            return callback(error);
          }
          console.log(results)
          return callback(null, results);
        }
    )
  },

  //schedule an existing flight
  scheduleFlight: (data, callback) =>{
    pool.query(
      `UPDATE flights_data set fromPlace=?, toPlace=?, startDate=?, startTime=?, endDate=?, endTime=?, 
        scheduledDays=?, instrumentUsed=?, premiumSeats=?, nonPremiumSeats=?, ticketCost=?, meals=? where flightNo=?`,
        [
        
          data.fromPlace,
          data.toPlace,
          data.startDate,
          data.startTime,
          data.endDate,
          data.endTime,
          data.scheduledDays,
          data.instrumentUsed,
          data.premiumSeats,
          data.nonPremiumSeats,
          data.ticketCost,
          data.meals,
          data.flightNo
        ],
        (error, results) => {
          if (error) {
            return callback(error);
          }
          return callback(null, results);
        }
    )
  },

  //update query to refresh airline_status in "flights_data" when admin blocks an airline
  updateAirlineStatus:(data)=>{
    pool.query(
      `UPDATE flights_data set airlineStatus=? where airline=?`,//check column names in both tables to avoid errors
    [data.status, data.airlineName]);

    //not giving callback
  }
  
};
