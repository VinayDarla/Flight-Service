const {
  newUser,
  getUserByEmail,

  getFlights,
  getReturnFlights,
  bookFlightById,
  compareData,
  checkSeatNumberStatus,

  ticketDataByPNR,
  userBookingHistory,
  cancelTicket,
  
} = require("./user.service");

//check for "body-parser usage"
var rn = require('random-number');

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");


module.exports = {
  
  //new user registration
  newUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

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
  userLogin: (req, res) => 
  {
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
            if (result) 
            {
                results.password = undefined;

                //json token creation
                const jsontoken = sign({ result: results, role:"User" }, process.env.JWT_ALGO, {
                  expiresIn: "20m",
                });
                
                return res.json({
                  sucess: 1,
                  message: "Login sucessful",
                  token: jsontoken,
                });

            } 
            else 
            {
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
                //storing flight travel time details
                body.startTime = result_data[0].startTime;
                body.endDate = result_data[0].endDate;
                body.endTime = result_data[0].endTime;

                //checking seat numbers are available or not
                checkSeatNumberStatus(body.seatNum, (err,count,seatsNotAvailable)=>{
                  if(err){
                    console.log(err);
                  }
                  //if "results" has "null" value
                  if(count==0)
                  {
                    console.log("Selected seats are available. Please proceed to checkout!")
                     
                    //pnr generation
                    var gen = rn.generator(
                    {
                          min:  0,
                          max:  1000000,
                          integer: true
                    })
                        let pnr = gen();
                        //passing pnr to body
                        body.pnr = pnr;

                        body.passengerDetails = JSON.stringify(body.passengerDetails);
                        body.seatNum = JSON.stringify(body.seatNum);

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
                    
                    return res.json({
                      success:0,
                      message:"Given seat numbers are booked. Please select other seats!",
                      seatsNotAvailable:seatsNotAvailable
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
    //console.log("line 255",body)

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

  //cancel ticket
  cancelTicket:(req,res)=>{
    const body = req.params.pnr;

        //using this function to get details of ticket
        ticketDataByPNR(body, (err,results)=>
        {
            if(err){
            console.log(err);
            }
            if(!results){
              return res.json({
                success:0,
                message:"Enter valid PNR number"
              })
            }
            else
            {
                  const data = results;

                      //calling "cancelTicket" function now..
                      cancelTicket(data, (err,results)=>
                      {
                        
                        if(err)
                        {
                          console.log(err);
                            return res.json({
                              success:0,
                              message:"Errror"
                            })
                        }
                        if(!results){
                            return res.json({
                              success:0,
                              message:"Date value comparison went wrong"
                            })
          
                        }
                        else{
                          return res.json({
                            success:1,
                            message:"Ticket is cancelled",
                            data:results
                          })
                        }

                      })
                    
              
            }
        })
    
  }
    
  };
