
// const express = require('express');

// const app =  express();


// app.use(function(req, res, next)   {
//     console.log("Hello from the server!!");
//     next();
// })

// app.get("/" ,(req, res) => {
//     res.send("Hello from dashboard page!!");
// })

// app.get("/home" ,(req, res) => {
//     res.send("Hello from the home page!!");
// })

// app.get("/test", (req, res) => {
//     res.send("Hello i am here to test the server route!!");
// })

// app.listen(3000, () => {
//     console.log("the server is started listening"); 
// })



const express = require("express");
const app = express();

// Middleware (Logs every request)
app.use((req, res, next) => {
    console.log(`📌 ${req.method} request to ${req.url}`);
    next();
});

// Specific routes
app.get("/home", (req, res) => {
    res.send("🏠 Welcome to Home Page!");
});

app.get("/contact", (req, res) => {
    res.send("📞 Contact Us Page");
});

// Handling all methods for /profile
app.use("/profile", (req, res) => {
    res.send("📸 Profile Page");
});

// Default response for unmatched routes
app.use((req, res) => {
    res.status(404).send("❌ Page Not Found");
});

// Start server
app.listen(3000, () => {
    console.log("🚀 Server is running on port 3000");
});
