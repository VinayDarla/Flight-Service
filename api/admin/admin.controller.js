const {
  createAdmin,
  getAdminByEmail,
  //logout function
  airlineRegister,
  airlineStatus,
  airlineBlock,
  addFlight,
  scheduleFlight,
  updateAirlineStatus

} = require("./admin.service");

const { genSaltSync, hashSync, compareSync } = require("bcrypt");

const { sign } = require("jsonwebtoken");

module.exports = {

  //create Admin
  createAdmin: (req, res) => {

    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    createAdmin(body, (err, results) => {
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


  //login 
  login: (req, res) => {
    const body = req.body;
    getAdminByEmail(body.email, (err, results) => {
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

  //logout

  //add Airline
  airlineRegister: (req,res)=>{
    const body = req.body;

    airlineRegister(body, (err,results)=>{
      if(err){
        console.log(err);
        return res.status(500).json({
          success:0,
          message: "DB connection error"
        });
      }
      return res.status(200).json({
        success: 1,
        data: results
      })

    })
  },

  //block airline
  airlineBlock: (req,res)=>{
    const body = req.body;

    //for "airlines" table
    airlineBlock(body, (err,results,status)=>{
      if(err){
        return res.status(500).json({
          success:0,
          message: "DB connection error"
        });
      }
      //since it is "patch" request we have to check affected rows 
      if(!results.affectedRows){
        return res.json({
          success: 0,
          message: "Given Airline data not found"
        })
      }
      return res.json({
        success: 1,
        message: `Airline status set to ${status}`,
      })
    })

    //for "flights" table --> not using any callbacks to track the error or to display result
    updateAirlineStatus(body);
  },


  //add a flight
  addFlight: (req,res) =>{
    const body = req.body;

    // const airlineName = body.airline;
    // var status;
    // airlineStatus(airlineName, (err,results)=>{
    //   if(err)
    //   console.log(err);

    //   return status = results;

    // })
    // console.log("line 141",status)

    //json data type is not given this time
    
    addFlight(body, (err,results)=>{
      if(err){
        return res.status(500).json({
          success:0,
          message: "DB connection error"
        });
      }
      return res.status(200).json({
        success: 1,
        data: results
      })
    })

  },

  //update Flight details
  scheduleFlight: (req, res) => {
    const body = req.body;

    scheduleFlight(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results.affectedRows) {
        return res.json({
          sucess: 0,
          message: "No data found. Enter Flight Number correctly",
        });
      }
      return res.json({
        success: 1,
        message: "Updated Flight details sucessfully",
      });
    });
  },


};
