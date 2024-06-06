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
const port = process.env.PORT || 5000;
const mongodb = require("mongodb");
const { MongoClient, ServerApiVersion } = require("mongodb");
// const url = "mongodb+srv://sharukajmal2:sharukdb@cluster0.cfzoga8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const url = "mongodb://127.0.0.1:27017/WASender";

//Scheduler Related Codes
//=====================================================================================================

//let date;
async function Call() {
    const client = new MongoClient(url);
    const db = await client.db("WASender");
    // // var schdate= new Date().toISOString();
    // // console.log(schdate);
    let date = new Date();
    date.setSeconds(0, 0);

    console.log(date.toISOString());

    // let getData= await db.collection("scheduled_messages").find({status: "pending", date: Date()}).sort({date: 1}).toArray();
    let getData = await db
        .collection("scheduled_messages")
        .find({ status: "pending", date: date.toISOString() })
        .sort({ date: 1 })
        .toArray();

    console.log(getData);

    //"2024-06-05T03:32:00.000Z"
    //  2024-06-05T03:31:00.960Z

    //   //console.log(getData[0]);
    if (getData[0]) {
        try {
            for (let i = 0; i < getData.length; i++) {
                console.log(getData[i]);
                let data;

                if (getData[i].type === "chat") {
                    data = qs.stringify({
                        token: `${getData[i].token}`,
                        to: `+${getData[i].to}`,
                        body: `${getData[i].body}`,
                    });
                } else if (getData[i].type === "contact") {
                    data = qs.stringify({
                        token: `${getData[i].token}`,
                        to: `+${getData[i].to}`,
                        contact: `${getData[i].contact}@c.us`,
                    });
                } else if (getData[i].type === "document") {
                    data = qs.stringify({
                        token: `${getData[i].token}`,
                        to: `+${getData[i].to}`,
                        filename: getData[i].fileName,
                        document: getData[i].document,
                        caption: getData[i].caption,
                    });
                } else if (getData[i].type === "image") {
                    data = qs.stringify({
                        token: `${getData[i].token}`,
                        to: `+${getData[i].to}`,
                        image: `${getData[i].image}`,
                        caption: `${getData[i].caption}`,
                    });
                } else if (getData[i].type === "video") {
                    data = qs.stringify({
                        token: `${getData[i].from.token}`,
                        to: `+${getData[i].to}`,
                        video: `${getData[i].video}`,
                        caption: `${getData[i].caption}`,
                    });
                } else if (getData[i].type === "audio") {
                    data = qs.stringify({
                        token: `${getData[i].token}`,
                        to: `+${getData[i].to}`,
                        audio: `${getData[i].audio}`,
                    });
                } else if (getData[i].type === "location") {
                    data = qs.stringify({
                        token: `${getData[i].token}`,
                        to: `+${getData[i].to}`,
                        address: `${getData[i].address}`,
                        lat: `${getData[i].lat}`,
                        lng: `${getData[i].lng}`,
                    });
                }

                let config = {
                    method: "post",
                    url: `https://api.ultramsg.com/${getData[i].instanceID}/messages/${getData[i].type}`, //type
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data: data,
                };

                await axios(config).then((ress) => {
                    console.log(ress.data);
                });

                await db
                    .collection("scheduled_messages")
                    .findOneAndUpdate(
                        { _id: getData[i]._id },
                        { $set: { status: "sent" } }
                    );
            }
        } catch (err) {
            console.log("error occured *****");

            console.log(err);
        }
    } else {
        console.log("nothing");
    }
    client.close();
}

const cron = require("node-cron");

// Schedule the cron job to run every minute
// cron.schedule(" * * * * *", () => {
//     // cron.schedule('*/2 * * * * *', () => {

//     Call();
// });

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
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: "*",
    })
);

app.use("/ablelyfwas", routez);

app.use(bodyParser.json());
app.listen(port, () => {
    console.log("app wasrendereing", port);
});
