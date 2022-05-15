const {

    createAdmin,
    adminLogin,
    
    airlineRegister,
    airlineBlock,

    addFlight,
    scheduleFlight
   
  } = require("./admin.controller");


const {
  
    newUser,
    userLogin,

    getFlights,
    bookFlightById,

    ticketDataByPNR,
    userBookingHistory,
    cancelTicket

  } = require("../users/user.controller");

const {checkAdminToken,checkUserToken} = require('../../auth/verifyAdminToken');




const router = require("express").Router();


//admin routes
router.post("/admin" , checkAdminToken, createAdmin);

router.post("/admin/login", adminLogin);


//routes related to Airline
router.post("/airline/register", checkAdminToken, airlineRegister);

router.patch("/airline/block", checkAdminToken,airlineBlock);

router.post("/airline/inventory/add", checkAdminToken, addFlight);

router.patch("/airline/inventory/update", checkAdminToken, scheduleFlight);


//USER ROUTES

router.post("/user" , newUser);

router.post('/user/login',userLogin)

router.post("/search", checkUserToken, getFlights);

router.post("/booking/:flightid", checkUserToken, bookFlightById)

router.get("/ticket/:pnr", checkUserToken, ticketDataByPNR);

router.get("/booking/history/:email", checkUserToken, userBookingHistory);

router.delete("/booking/cancel/:pnr", checkUserToken, cancelTicket)



module.exports = router; 