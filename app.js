const express = require('express');
const app = express();

app.get("/api" ,(req, res) => {
    res.json({
        success: 1,
        message: "this is success message"
    })
})

app.listen(3000, () => {
    console.log("server up and running");
})
