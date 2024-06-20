const express = require("express");
const app = express();
const http = require("https");
const server = http.createServer(app);
const cors = require("cors");
const cookieParser = require("cookie-parser");
const schedule = require("node-schedule");
const axios = require("axios");
var qs = require("querystring");
const bodyParser = require("body-parser");
const routez = require("./routes/wasRoutes");
const { Call } = require("./scheduler.js");
const port = process.env.PORT || 5000;
const mongodb = require("mongodb");
const { MongoClient, ServerApiVersion } = require("mongodb");

// const url = "mongodb+srv://sharukajmal2:sharukdb@cluster0.cfzoga8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const url = "mongodb://127.0.0.1:27017/WASender";

//Scheduler Related Codes
//=====================================================================================================

//let date;

const cron = require("node-cron");

// Schedule the cron job to run every minute
cron.schedule(" * * * * *", () => {
    console.log("scheduled called");
    Call();
});

// async function a (){
//   try{
//     var schdate= new Date().toISOString();
//     console.log(`Hello ${schdate}`);
//     var date= new Date();
//     //var date = await  Scheduler.findOne().then(data=> date=data.msg);
//     console.log(schdate);

//   }
//   catch(err){
//     console.log(err)
//   }

// }
// a();

//=====================================================================================================

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    }),
);
app.use(express.json());

app.use(
    cors({
        origin: "*",
    }),
);

app.use("/ablelyfwas", routez);

app.use(bodyParser.json());
app.listen(port, () => {
    console.log("app wasrendereing", port);
});
