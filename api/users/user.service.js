const pool = require("../../config/users_database");

const airline_Pool = require("../../config/airline_database");
const res = require("express/lib/response");
const { DATE } = require("mysql/lib/protocol/constants/types");

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
    [data],
    (error, results) => {
      if (error) {

        return callback(error);
      }
     
      return callback(null, results[0]);
    }

  );
},


  //flight search
  getFlights: (body, callback) => {

    airline_Pool.query(
      `SELECT flightNo,airline,startTime, endDate, endTime, ticketCost,meals FROM flights_data 
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
      `SELECT flightNo,airline,startDate, startTime, endDate, endTime, ticketCost,meals FROM flights_data 
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
      `INSERT into ticketbooking_data(name,email, flightNo, pnr,fromPlace, toPlace,
        startDate, startTime, endDate,endTime, passengerDetails, seatClass, seatNum, meals, roundTrip)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.name,
        data.email,
        data.flightNo,
        data.pnr,
        data.fromPlace,
        data.toPlace,
        data.startDate,
        data.startTime,
        data.endDate,
        data.endTime,
        data.passengerDetails,
        data.seatClass,
        data.seatNum,
        data.meals,
        data.roundTrip
      ],
      (error, results) => {
        if (error) {
          console.log("line 111",error)
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
        if(error){
          console.log("line 128",error)
          return callback(error);
        }
        

        return callback(null,results[0])
      }
    )
  },

  //check seat availability
checkSeatNumberStatus:(data, callback)=>{
    
  //const results_data=[];
  var count=0;
  var len = data.length;
  const seatsNotAvailable=[];
    
  for (let i = 0; i < data.length; i++) 
  {  
    //console.log("line 145",data[i])
    pool.query(
      `SELECT * FROM ticketbooking_data WHERE JSON_CONTAINS(seatNum, '${data[i]}','$') `,
            (err, results)=>{
                if(err)
                return callback(err);
            
                  //"results" will be in array
                  if(results.length!=0){
                    count++;  
                    //storing "data[i]" into an array
                    seatsNotAvailable.push(data[i]);
                  }
                  //console.log("line 167",count);

                  //if "i" is at last index----> return results
                  if(i==(len-1))
                  {
                    //console.log("line 171",count)
                    return callback(null, count,seatsNotAvailable)
                  }  
          }
      )
  }
  

},


  ticketDataByPNR:(data,callback)=>{
    pool.query(
      `SELECT * from ticketbooking_data WHERE pnr=?`,
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
  },


  //cancel ticket
  cancelTicket: (data,callback)=>{
    
      pool.query(
        `DELETE FROM ticketbooking_data WHERE pnr = ${data.pnr} AND startDate> CURDATE()`,
        (error,results)=>{
          if(error)
          return callback(error);

          console.log("line 221",results);
          return callback(null,results);
        }
      )
    }
    
  
 
}

 