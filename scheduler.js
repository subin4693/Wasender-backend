const { MongoClient, ServerApiVersion } = require("mongodb");
const url =
  "mongodb+srv://subin:Password@cluster0.tvgqpfe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var qs = require("querystring");
const axios = require("axios");

exports.handleSendMsg = (req, res) => {
  try {
    console.log(req.body);
    //   let dataObj = req.body;
    //   let toDataNumbers = dataObj.to;
    //   console.log(toDataNumbers);
    //   for (let i = 0; i < toDataNumbers.length; i++) {
    //     let data;

    //     if (dataObj.type === "chat") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         body: `${dataObj.body}`,
    //       });
    //     } else if (dataObj.type === "contact") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         contact: `${dataObj.body}@c.us`,
    //       });
    //     } else if (dataObj.type === "document") {
    //       console.log(dataObj.fileName);
    //       data = qs.stringify({
    //         token: dataObj.from.token,
    //         to: `+${toDataNumbers[i].number}`,
    //         filename: dataObj.fileName,
    //         document: dataObj.file,
    //         caption: dataObj.body,
    //       });
    //     } else if (dataObj.type === "image") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         image: `${dataObj.file}`,
    //         caption: `${dataObj.body}`,
    //       });
    //     } else if (dataObj.type === "video") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         video: `${dataObj.file}`,
    //         caption: `${dataObj.body}`,
    //       });
    //     } else if (dataObj.type === "audio") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         audio: `${dataObj.file}`,
    //       });
    //     } else if (dataObj.type === "location") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         address: `${dataObj.body}`,
    //         lat: `${dataObj.lat}`,
    //         lng: `${dataObj.lng}`,
    //       });
    //     }

    //     let config = {
    //       method: "post",
    //       url: `https://api.ultramsg.com/${dataObj.from.instanceID}/messages/${dataObj.type}`, //type
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       },
    //       data: data,
    //     };

    //     axios(config).then((ress) => {
    //       console.log(ress.data);
    //     });
    //   }

    //   res.json({
    //     message: "sent",
    //   });
  } catch (err) {
    console.log(err);
  }
};

exports.Call = async () => {
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
            { $set: { status: "sent" } },
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
};
