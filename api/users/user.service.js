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
        body.fromPlace,
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
      `INSERT into ticketbooking_data(name,email, flightNo, fromPlace, toPlace,
        startDate, startTime, endTime, passengerDetails, seatClass, seatNum, meals, roundTrip)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.name,
        data.email,
        data.flightNo,
        //pnr number
        data.fromPlace,
        data.toPlace,
        data.startDate,
        data.startTime,
        data.endTime,
        data.passengerDetails,
        data.seatClass,
        data.seatNum,
        data.meals,
        data.roundTrip
      ],
      (error, results) => {
        if (error) {

          return callback(error);
        }
        return callback(null, results);
      }
    )
  },


  //query to compare flight data and user booking data
  compareData:(data, callback)=>{

    airline_Pool.query(
      `SELECT * FROM flights_data WHERE flightNo=?`,
      [data.flightNo],
      (error, results)=>{
        if(error)
        return callback(error);

        return callback(null,results[0])
      }
    )
  },

  //check seat availability
  checkSeatNumberStatus:(data, callback) =>{
    
    const results_data=[];
    
    for(let i=0;i<data.length;i++)
    {
      console.log("line 137",data[i])
        pool.query(
          //`SELECT @result = JSON_CONTAINS(seatNum, '${data}','$') FROM ticketbooking_data`,

          `SELECT * FROM ticketbooking_data WHERE JSON_CONTAINS(seatNum, '${data[i]}','$') `,
          
        (err, results)=>{
          if(err)
          return callback(err);
          else{
            
            //"results" will be in array
            //console.log("line 144",results)
            if(results.length!=0){
              results_data.push(results);
              
            }
          }
          
        }
    )
    
    }
    return callback(null, results_data)
  },

  ticketDataByPNR:(data,callback)=>{
    pool.query(
      `search * from ticketbooking_data WHERE pnr=?`,
      [data],
      (error,results)=>{
        if(error)
        return callback(error);
        else
        return callback(null,results[0]);
      }
    )
  },

  //get ticket data based on "name"
  userBookingHistory:(data, callback)=>{
    pool.query(
      `SELECT * FROM ticketbooking_data WHERE email=? `,
      [data],
      (error, results)=>{
        if(error)
        return callback(error);
        else
        return callback(null, results);
      }
    )
  }


  

  

 
  
  
}

 