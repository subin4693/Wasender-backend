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
const { connectToDatabase, closeDatabaseConnection } = require("./db");
const { TextClassifier, FilesetResolver } = require("@mediapipe/tasks-text");

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

let textClassifier;

async function createTextClassifier() {
    const text = await FilesetResolver.forTextTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0/wasm",
    );
    textClassifier = await TextClassifier.createFromOptions(text, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/text_classifier/bert_classifier/float32/1/bert_classifier.tflite",
        },
        maxResults: 5,
    });
}

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

process.on("SIGINT", async () => {
    await closeDatabaseConnection();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await closeDatabaseConnection();
    process.exit(0);
});

//module.exports = textClassifier;
