require('dotenv').config();
const express = require('express');
const app = express();
const adminRouter = require("./api/admin/admin.router");

app.use(express.json());
app.use("/api/v1.0/flight", adminRouter);


app.listen(process.env.APP_PORT, () => {
    console.log(`Server up and running on port ${process.env.APP_PORT}`);
})
