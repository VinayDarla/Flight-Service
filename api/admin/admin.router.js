const {
    createAdmin,
    login,
    //logout function
    airlineRegister,
    airlineBlock,
    addFlight,
    scheduleFlight
   
  } = require("./admin.controller");

const {
    newUser,
    //login,
    getFlights,
    bookFlightById,
    ticketDataByPNR,
    userBookingHistory
  } = require("../users/user.controller");


const router = require("express").Router();

//admin routes
router.post("/admin" , createAdmin);

router.post("/admin/login",login);

//logout route
//router.post("/admin/logout", );

router.post("/airline/register", airlineRegister);

router.patch("/airline/block", airlineBlock);

router.post("/airline/inventory/add", addFlight);

router.patch("/airline/inventory/update", scheduleFlight);

//USER ROUTES
router.post("/search", getFlights);

router.post("/user" , newUser);

router.post("/booking/:flightid", bookFlightById)

router.post("/ticket/:pnr", ticketDataByPNR);

router.post("/booking/history/:email", userBookingHistory);



module.exports = router; 