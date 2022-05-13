const {
  newUser,
  getUserByEmail,
  getFlights,
  getReturnFlights,
  bookFlightById
} = require("./user.service");

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
          
          return res.status(200).json({
          success: 1,
          data: results,
          });
      })
    }
    //if user selects round trip
    else
    {
      const searchData = [];
      getFlights(body, (err,results)=>{
          if(err)
          console.log(err);
        //storing first search result in zero index
        searchData[0] = results;
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

          searchData.push(results);

          return res.status(200).json({
            success:1,
            data:searchData
          })
      })
    }
  
  },


  
  //book a flight
  
};
