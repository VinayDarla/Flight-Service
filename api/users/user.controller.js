const {
  newUser,
  getUserByEmail,

  getFlights,
  getReturnFlights,
  bookFlightById,
  compareData,
  checkSeatNumberStatus,

  ticketDataByPNR,
  userBookingHistory
} = require("./user.service");

//check for "body-parser usage"
var rn = require('random-number');
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  
  //new user registration
  newUser: (req, res) => {
    const body = req.body;
    // const salt = genSaltSync(10);
    // body.password = hashSync(body.password, salt);

    newUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Db connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  //user login
  login: (req, res) => {
    const body = req.body;
    getUserByEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          sucess: 0,
          message: "Invalid email or password",
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, "qwe1234", {
          expiresIn: "1h",
        });
        return res.json({
          sucess: 1,
          message: "Login sucessful",
          token: jsontoken,
        });
      } else {
        return res.json({
          sucess: 0,
          message: "Invalid email or password",
        });
      }
    });
  },


  //search flights
  getFlights: (req, res) => {

    //user search data
    const body = req.body;

    if(!body.roundTrip)
    {
      //searching flights based on airline status
      getFlights(body, (err, results) =>{
        
          if (err)
          {
            return res.status(500).json({
              success: 0,
              message: "Db connection error",
            });
          }
          //if no flights are found
          if(!results){
            return res.status(200).json({
              success: 0,
              message:"No flights are found"
            })
          }
            //pnr testing
                var gen = rn.generator(
                {
                  min:  0,
                  max:  1000000,
                  integer: true
                })
                console.log("line 106 pnr",gen());
          
          return res.status(200).json({
          success: 1,
          data: results,
          });
      })
    }
    //if user selects round trip
    else
    {
      const flightsData = [];
      getFlights(body, (err,results)=>{
          if(err)
          console.log(err);
        //storing first search result in zero index
        flightsData[0] = results;

      })

      getReturnFlights(body, (err,results)=>{
          if (err)
          {
            return res.status(500).json({
              success: 0,
              message: "Db connection error",
            });
          }
          if(!results){
            return res.status(200).json({
              success:0,
              message:"Return flights within same airline are not found"
            })
          }

          flightsData.push(results);

          console.log("line 132",flightsData);
          //calculating total price for round trip
          let Price = {
            totalPrice: flightsData[0].ticketCost + flightsData[1].ticketCost };

            flightsData.push(Price);
          return res.status(200).json({
            success:1,
            data:flightsData
          })
      })
    }
  
  },


  
  //book a flight
  bookFlightById: (req,res) =>{
    const body = req.body;
    const result_data = [];


    compareData(body, (err,results)=>{
      if(err)
      return res.json({
        success:0,
        "message":"error"
      })
      
     result_data[0] = results;
      //console.log("line 164");
      
    
        //comparing data
  
        if(result_data[0].fromPlace== body.fromPlace && result_data[0].toPlace==body.toPlace && 
          result_data[0].startDate == body.startDate)
          // check meals condition
        {
              
                body.startTime = result_data[0].startTime;
                body.endTime = result_data[0].endTime;

                body.passengerDetails = JSON.stringify(body.passengerDetails);
                body.seatNum = JSON.stringify(body.seatNum);

                //console.log("line 181",body.seatNum);

                //checking seat numbers are available or not
                checkSeatNumberStatus(body.seatNum, (err,results)=>{
                  if(err){
                    console.log(err);
                  }
                  //if "results" has "null" value
                  if(results.length==0)
                  {
                    console.log("Selected seats are available. Please proceed to checkout!")
                        //calling this method
                        bookFlightById(body, (err,results)=>{
                            if(err){
                              console.log(err)
                              return res.json({
                                success:0,
                                message:"DB connection error"
                              })
                            }
                            else
                            {
                                return res.json({
                                  success:1,
                                  data:results
                                })
                              
                            }
                        })
                  }
                  //if "results" have value means given "seats" are already booked
                  else
                  {
                    //console.log(results)
                    return res.json({
                      success:0,
                      message:"Given seat numbers are booked. Please select other seats!"
                    })
                  }
                  
              })
        
        }
        else
        {
          return res.json({
            success:0,
            message: "Given data does not match with Flight data"
          })
        }
  })
},



ticketDataByPNR: (req,res)=>{

  const body = req.params.pnr;

  ticketDataByPNR(body, (err,results)=>{
    if(err){
      return res.json({
        success:0,
        message:"Connection Errror"
      })
    }
    if(!results){
      return res.json({
        success:0,
        message:"Enter valid PNR number"
      })
    }
    else{
      results.passengerDetails = JSON.parse(results.passengerDetails)
      results.seatNum = JSON.parse(results.seatNum)
      
      return res.json({
        success:1,
        data:results
      })
    }
  })
},



userBookingHistory:(req,res)=>{
  const body = req.params.email;

  userBookingHistory(body, (err,results)=>{
    if(err)
    {
      console.log("line 225", err);
      return res.json({
        success:0,
        message:"Errror"
      })
    }
      else
      {
        results.forEach(element => {
          //parsing the "JSOn object"
          element.seatNum=JSON.parse(element.seatNum)

          element.passengerDetails=JSON.parse(element.passengerDetails)
        });
        

        return res.json({
          success:1,
          data:results
        })

      }
    
  })
},
  
};
