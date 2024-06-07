const uniqid = require("uniqid");
//const { MongoClient, ObjectId, ChangeStream } = require("mongodb");
const { mongodb, ObjectId } = require("mongodb");
const http = require("https");
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const url =
    "mongodb+srv://subin:Password@cluster0.tvgqpfe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const url = "mongodb://127.0.0.1:27017/WASender";

// const url =
//   "mongodb+srv://yadharth:1234567890@wasender.qenvxus.mongodb.net/?retryWrites=true&w=majority";
// const url =
//   "mongodb+srv://sharukajmal2:SharukDB%40123@cluster0.cfzoga8.mongodb.net/?retryWrites=true&w=majority";
const axios = require("axios");
const qs = require("qs");
const nodeBase64 = require("nodejs-base64-converter");

exports.handleSignin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        const collection = db.collection("users");

        const user = await collection.findOne({ email });

        const match = await bcryptjs.compare(password, user.password);

        if (!match) {
            await client.close();
            return res.json({ message: "signin failed" });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRECT,
        );
        // res.cookie("token", "bearer " + token);
        await client.close();
        res.json({
            message: "signin success",
            data: { id: user._id, email: user.email, role: user.role },
        });
    } catch (err) {
        console.log(err);
        res.json({
            message: req.body,
        });
    }
};

exports.handleSignUp = async (req, res) => {
    try {
        const { email, password } = req.body;

        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        const collection = db.collection("users");
        let mailList = await collection.findOne({ email });

        if (mailList) {
            await client.close();
            return res.status(400).json({ message: "User already exists" });
        } else {
            const hashed = await bcryptjs.hash(password, 8);
            const result = await collection.insertOne({
                email: req.body.email,
                password: hashed,
                role: "user",
            });

            const insertedUser = await collection.findOne(
                { _id: result.insertedId },
                { projection: { role: 1, email: 1 } },
            );

            const token = jwt.sign(
                { id: insertedUser._id, role: insertedUser.role },
                process.env.JWT_SECRECT,
            );
            res.cookie("token", "bearer " + token);

            await client.close();
            res.status(201).json({
                message: "signup success",
                data: { ...insertedUser },
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            message: req.body,
        });
    }
};

//////////devices(instances)
exports.handleSetDevices = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        let dataObj = {
            admin: req.body?.admin,
            adminID: req.body?.adminID,
            name: req.body.name,
            number: req.body.number,
            instanceID: "instance87295",
            token: "sstdltegyIn6p9e",
            deviceID: uniqid(),
            authenthicate: false,
            created: new Date(),
            paid: "",
            expiry: "",
            status: "Inactive",
        };
        await db.collection("devices").insertOne(dataObj);
        await client.close();
        res.json({
            message: "set success",
        });
    } catch (err) {
        console.log(err);
        res.json({
            message: req.body,
        });
    }
};
exports.handleGetDevices = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        let insertData = await db.collection("devices").find({}).toArray();
        await client.close();
        res.json({
            arrData: insertData,
            message: "receive Sucess",
        });
    } catch (err) {
        console.log(err);
        res.json({
            message: "receive failure",
        });
    }
};
exports.handleInstance = async (req, res) => {
    try {
        let dataObj = req.body;
        let config = {
            method: "get",
            url: `https://api.ultramsg.com/${dataObj.instanceID}/instance/status`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            params: {
                token: dataObj.token,
            },
        };

        axios(config)
            .then(async (response) => {
                /////////
                console.log(response?.data?.status);

                if (
                    response?.data?.status?.accountStatus?.status ===
                    "authenticated"
                ) {
                    console.log("authenthicated");
                    const client = await MongoClient.connect(url);
                    const db = client.db("WASender");
                    await db.collection("devices").findOneAndUpdate(
                        {
                            _id: new ObjectId(dataObj["_id"]),
                        },
                        {
                            $set: {
                                authenthicate: true,
                            },
                        },
                    );

                    await client.close();
                    res.json({
                        message: response?.data?.status?.accountStatus?.status,
                    });
                } else if (
                    response?.data?.status?.accountStatus?.status === "standby"
                ) {
                    console.log("still in stanby");
                    res.json({
                        message: response?.data?.status?.accountStatus?.status,
                    });
                } else if (
                    response?.data?.status?.accountStatus?.status === "loading"
                ) {
                    await this.handleInstance(req, res);
                }

                //////////
            })
            .catch((error) => {
                res.json({
                    message: "thirdParty Failure",
                });
            });
    } catch (err) {
        console.log(err);
        res.json({
            message: "instance failure",
        });
    }
};

const handleInsStatus = () => {
    try {
    } catch (err) {
        console.log(err);
    }
};
//doubts
exports.handleInstanceChange = async (req, res) => {
    try {
        let { dataObj, type } = req.body;
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        console.log(dataObj, type);
        if (type === "status") {
            await db.collection("devices").findOneAndUpdate(
                {
                    _id: new ObjectId(dataObj["_id"]),
                },
                {
                    $set: {
                        authenthicate: true,
                    },
                },
            );
        }
        await client.close();
        res.json({
            message: `${type} changed`,
        });
    } catch (err) {
        console.log(err);
        res.json({
            message: `${type} failure`,
        });
    }
};
exports.handleInstanceDetails = async (req, res) => {
    try {
        let dataObj = req.body;

        let config = {
            method: "get",
            url: `https://api.ultramsg.com/${dataObj.instanceID}/messages/statistics`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            params: {
                token: dataObj.token,
            },
        };

        axios(config)
            .then((response) => {
                res.json({
                    message: response.data,
                });
            })
            .catch((error) => {
                res.json({
                    message: "thirdParty Failure",
                });
            });
    } catch (err) {
        console.log(err);

        res.json({
            message: `details failure`,
        });
    }
};
exports.handleQrCode = async (req, res) => {
    try {
        let dataObj = req.body;
        console.log(dataObj.instanceID, dataObj.token);
        let config = {
            method: "get",
            url: `https://api.ultramsg.com/${dataObj.instanceID}/instance/qr`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            params: {
                token: dataObj.token,
            },
        };

        axios(config)
            .then((response) => {
                console.log("finished");
                res.json({
                    message: true,
                });
            })
            .catch((error) => {
                res.json({
                    message: "thirdParty Failure",
                });
            });
    } catch (err) {
        console.log(err);
        res.json({
            message: "qr failure",
        });
    }
};

//
exports.handleSetContacts = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");

        let dataObj = {
            admin: req.body?.admin,
            adminID: req.body?.adminID,
            name: req.body.name,
            number: req.body.number,
            created: new Date(),
            contactID: uniqid(),
        };
        await db.collection("contacts").insertOne(dataObj);
        await client.close();
        res.json({
            message: "set success",
        });
    } catch (err) {
        console.log(err);
        res.json({
            message: "set failure",
        });
    }
};
exports.handleEditContacts = async (req, res) => {
    try {
        console.log(req.body.dataObj, req.body.contact);
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");

        await db.collection("contacts").findOneAndUpdate(
            { contactID: req.body.contact.contactID },
            {
                $set: {
                    name: req.body.dataObj.name,
                    number: req.body.dataObj.number,
                },
            },
            { new: true },
        );
        await client.close();
        res.json({
            message: "update success",
        });
    } catch (err) {
        console.log(err);
    }
};
exports.handleBulkContacts = async (req, res) => {
    try {
        console.log(req.body);
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");

        let dataObj = {
            admin: req.body?.admin,
            adminID: req.body?.adminID,
            name: req.body.name,
            number: req.body.number,
            created: new Date(),
            contactID: uniqid(),
        };
        let insertData = await db.collection("contacts").insertOne(dataObj);
        await client.close();
        res.json({
            message: "set success",
        });
    } catch (err) {
        console.log(err);
    }
};
exports.handleGetContacts = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        let getData = await db.collection("contacts").find({}).toArray();
        await client.close();
        res.json({
            msgArr: getData,
        });
    } catch (err) {
        console.log(err);
    }
};
exports.handleDeleteContacts = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");

        console.log(req.body);
        await db
            .collection("contacts")
            .deleteOne({ contactID: req.body.data.contactID });
        await client.close();
        res.json({
            msgArr: "del success",
        });
    } catch (err) {
        console.log("del fail");
    }
};
exports.handleSendMsg = (req, res) => {
    try {
        console.log(req.body);
        let dataObj = req.body;
        let toDataNumbers = dataObj.to;
        console.log(toDataNumbers);
        for (let i = 0; i < toDataNumbers.length; i++) {
            let data;

            if (dataObj.type === "chat") {
                data = qs.stringify({
                    token: `${dataObj.from.token}`,
                    to: `+${toDataNumbers[i].number}`,
                    body: `${dataObj.body}`,
                });
            } else if (dataObj.type === "contact") {
                data = qs.stringify({
                    token: `${dataObj.from.token}`,
                    to: `+${toDataNumbers[i].number}`,
                    contact: `${dataObj.body}@c.us`,
                });
            } else if (dataObj.type === "document") {
                console.log(dataObj.fileName);
                data = qs.stringify({
                    token: dataObj.from.token,
                    to: `+${toDataNumbers[i].number}`,
                    filename: dataObj.fileName,
                    document: dataObj.file,
                    caption: dataObj.body,
                });
            } else if (dataObj.type === "image") {
                data = qs.stringify({
                    token: `${dataObj.from.token}`,
                    to: `+${toDataNumbers[i].number}`,
                    image: `${dataObj.file}`,
                    caption: `${dataObj.body}`,
                });
            } else if (dataObj.type === "video") {
                data = qs.stringify({
                    token: `${dataObj.from.token}`,
                    to: `+${toDataNumbers[i].number}`,
                    video: `${dataObj.file}`,
                    caption: `${dataObj.body}`,
                });
            } else if (dataObj.type === "audio") {
                data = qs.stringify({
                    token: `${dataObj.from.token}`,
                    to: `+${toDataNumbers[i].number}`,
                    audio: `${dataObj.file}`,
                });
            } else if (dataObj.type === "location") {
                data = qs.stringify({
                    token: `${dataObj.from.token}`,
                    to: `+${toDataNumbers[i].number}`,
                    address: `${dataObj.body}`,
                    lat: `${dataObj.lat}`,
                    lng: `${dataObj.lng}`,
                });
            }

            let config = {
                method: "post",
                url: `https://api.ultramsg.com/${dataObj.from.instanceID}/messages/${dataObj.type}`, //type
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: data,
            };

            axios(config).then((ress) => {
                console.log(ress.data);
            });
        }

        res.json({
            message: "sent",
        });
    } catch (err) {
        console.log(err);
    }
};
exports.handleImportBulk = async (req, res) => {
    try {
        const params = {
            token: "instance84036",
        };

        const config = {
            method: "get",
            url: "https://api.ultramsg.com/instance84036/contacts",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            params: params,
        };

        await axios(config).then(async (obj) => {
            let dataObj = [],
                postObj = [];

            if (obj?.data.length) {
                let arrObj = obj?.data;

                for (let i = 0; i < arrObj.length; i++) {
                    if (
                        arrObj[i] &&
                        !arrObj[i].isGroup &&
                        arrObj[i].name &&
                        arrObj[i].number
                    ) {
                        dataObj.push(arrObj[i]);
                        postObj.push({
                            name: arrObj[i].name,
                            number: arrObj[i].number,
                            created: new Date(),
                            contactID: uniqid(),
                            finalno: arrObj[i].number,
                        });
                    }
                }

                const client = await MongoClient.connect(url);
                const db = client.db("WASender");
                await db.collection("contacts").insertMany(postObj);
                await client.close();
                res.json({
                    arrData: postObj,
                    message: "success",
                });
                console.log("Success");
            }
        });
    } catch (err) {
        console.log(err);
    }
};
exports.handleDuplicates = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        let getData = await db.collection("contacts").find({}).toArray();
        let arrObj = [];

        for (let i = 0; i < getData.length; i++) {
            if (!arrObj.includes(getData[i].number)) {
                arrObj.push(getData[i].number);
            } else {
                console.log(getData[i].contactID);
                await db
                    .collection("contacts")
                    .deleteOne({ contactID: getData[i].contactID });
            }
        }

        await client.close();
        res.json({
            message: "duplicates deleted",
        });
    } catch (err) {
        console.log(err);
    }
};
exports.handleLogMessages = async (req, res) => {
    try {
        let dataObj = req.body;
        let params = {
            token: dataObj.obj.token,
            page: 1,
            limit: 100,
            status: "all",
            sort: "desc",
        };

        let config = {
            method: "get",
            url: `https://api.ultramsg.com/${dataObj.obj.instanceID}/messages`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            params: params,
        };

        await axios(config).then((response) => {
            res.json({
                message: response.data,
            });
        });
    } catch (err) {
        console.log(err);
    }
};
exports.handleLogChats = async (req, res) => {
    try {
        let { fromSelect, toSelect } = req.body;
        console.log(
            fromSelect.token,
            `${toSelect.number}@c.us`,
            fromSelect.instanceID,
        );
        let params = {
            token: fromSelect.token,
            chatId: `${toSelect.number}@c.us`,
            limit: 100,
        };

        let config = {
            method: "get",
            url: `https://api.ultramsg.com/${fromSelect.instanceID}/chats/messages`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            params: params,
        };

        axios(config).then((response) => {
            res.json({
                message: response.data,
            });
        });
    } catch (err) {
        console.log(err);
    }
};
exports.handleCreateReply = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");

        let dataObj = req.body;
        await db.collection("reply").insertOne(dataObj);
        await client.close();
        res.json({
            msg: "posted success",
        });
    } catch (err) {
        console.log(err);
        res.json({
            msg: err,
        });
    }
};
exports.handleGetReply = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        let getData = await db.collection("reply").find({}).toArray();
        await client.close();
        res.json({
            msg: getData,
        });
    } catch (err) {
        console.log(err);
        res.json({
            msg: err,
        });
    }
};
exports.handleIdReply = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        let getData = await db
            .collection("reply")
            .findOne({ _id: new ObjectId(req.body.id) });
        await client.close();
        res.json({
            msg: getData,
        });
    } catch (err) {
        console.log(err);
        res.json({
            msg: err,
        });
    }
};
exports.handleDeleteReply = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        let dataObj = req.body;
        let getData = await db
            .collection("reply")
            .findOneAndDelete({ _id: new ObjectId(dataObj["_id"]) })
            .toArray();
        console.log(getData);
        await client.close();
        res.json({
            msg: "delete",
        });
    } catch (err) {
        console.log(err);
        res.json({
            msg: err,
        });
    }
};
exports.handleEditReply = async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");
        const { dataObj, id } = req.body;
        let postData = await db.collection("reply").findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    message: dataObj.message,
                    to: dataObj.to,
                    from: dataObj.from,
                    file: dataObj.file?.toString(),
                    fileName: dataObj.fileName,
                    body: dataObj.body,
                    lat: dataObj.lat,
                    lng: dataObj.lng,
                    type: dataObj.type,
                },
            },
        );
        await client.close();
        res.json({
            msg: "edit success",
        });
    } catch (err) {
        console.log(err);
        res.json({
            msg: err,
        });
    }
};

//-----------------------------------------------------------------------------------------

exports.ultramsgwebhook = async (req, res) => {
    try {
        console.log(req.body);

        const instanceId = "instance" + req.body.instanceId;
        const messageMsg = req.body["data"]["body"]; // Message text
        const from = req.body.data.to.split("@")[0].match(/\d+/g).join("");
        const to = req.body.data.from.split("@")[0].match(/\d+/g).join("");

        const client = new MongoClient(url, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        const db = client.db("WASender");

        const query = {
            "to.number": to,
            from: {
                $elemMatch: {
                    number: from,
                    instanceID: instanceId,
                },
            },

            message: messageMsg,
        };
        let values = await db.collection("reply").findOne(query);
        console.log("*******************");
        console.log(query);
        console.log("*******************");

        console.log(values);
        console.log("*******************");

        return res.status(200).json({ message: "working fine" });
        //////// await db.collection("trigger").insertOne({
        ////////       _id: 1,
        ////////       text: messageMsg
        ////////           });
        ////////   await client.close();

        // let insertData = await db.collection("trigger").findOne({});

        let insertData = await db.collection("trigger").findOne({ _id: 1 });
        if (insertData) {
            if (messageMsg == "Intro") {
                optionOne();
            }
            if (messageMsg == "Prices") {
                optionTwo();
            }
            if (messageMsg == "Details") {
                optionThree();
            }
            console.log("Already Triggered");
            await db.collection("trigger").findOneAndDelete({ _id: 1 });
            res.status(200).end();
        } else {
            if (messageMsg == "Hi Sharuk") {
                triggerbot();
                await db.collection("trigger").insertOne({
                    _id: 1,
                    text: messageMsg,
                });
                await client.close();
            } else {
                invalidBot();
                res.status(200).end();
            }
            console.log(insertData);
            console.log(req.body);
            res.status(200).end();
        }

        //Get received msg and from number
        //const messageFrom=req.body['data']['from'] // sender number

        // if (messageMsg == "Hi Sharuk") {
        //   //Trigger Bot
        //   console.log(req.body["data"]["body"]);
        //   res.status(200).end();
        //   triggerbot();

        //       // if (newMsg == 'Intro'){
        //       //   optionOne();
        //       // }
        //       // if (newMsg == 'Prices'){
        //       //   optionTwo();
        //       // }
        //       // if (newMsg == 'Details'){
        //       //   optionThree();
        //       // }
        //       // else {
        //       //   invalidBot()
        //       // }
        // }
        // if (messageMsg == 'Intro'){
        //   optionOne();
        // }
        // if (messageMsg == 'Prices'){
        //   optionTwo();
        // }
        // if (messageMsg == 'Details'){
        //   optionThree();
        // }
        // else {
        //   console.log(req.body);
        //   console.log("Bot is not started");
        //   res.status(200).end();
        // }

        //Trigger Text Bot
        function triggerbot() {
            console.log("triggered");
            var options = {
                method: "POST",
                hostname: "api.ultramsg.com",
                port: null,
                path: "/instance77326/messages/chat",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            };

            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            });
            var postData = qs.stringify({
                token: "tz4c7nm9r4luh6i4",
                //"to": "120363158438640142@g.us",
                to: to,
                body: `Welcome You to our Product
                        Select your Query Option
                        1. Intro
                        2. Prices
                        3. Details`,
            });
            req.write(postData);
            req.end();
            res.status(200).end();
            console.log(req.body);
        }

        //Selecting Option 1
        function optionOne() {
            var options = {
                method: "POST",
                hostname: "api.ultramsg.com",
                port: null,
                path: "/instance77326/messages/image",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            };

            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            });
            var postData = qs.stringify({
                token: "tz4c7nm9r4luh6i4",
                to: to,
                image: "https://t4.ftcdn.net/jpg/03/17/25/45/360_F_317254576_lKDALRrvGoBr7gQSa1k4kJBx7O2D15dc.jpg",
                caption: `Intro Image`,
            });
            req.write(postData);
            req.end();

            console.log(req.body);
            res.status(200).end();
        }

        //Selecting Option 2
        function optionTwo() {
            var options = {
                method: "POST",
                hostname: "api.ultramsg.com",
                port: null,
                path: "/instance77326/messages/image",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            };

            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            });
            var postData = qs.stringify({
                token: "tz4c7nm9r4luh6i4",
                to: to,
                image: "https://t4.ftcdn.net/jpg/03/17/25/45/360_F_317254576_lKDALRrvGoBr7gQSa1k4kJBx7O2D15dc.jpg",
                caption: `Prices Image`,
            });
            req.write(postData);
            req.end();

            console.log(req.body);
            res.status(200).end();
        }

        //Selecting Option 3
        function optionThree() {
            var options = {
                method: "POST",
                hostname: "api.ultramsg.com",
                port: null,
                path: "/instance77326/messages/image",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            };

            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            });
            var postData = qs.stringify({
                token: "tz4c7nm9r4luh6i4",
                to: to,
                image: "https://t4.ftcdn.net/jpg/03/17/25/45/360_F_317254576_lKDALRrvGoBr7gQSa1k4kJBx7O2D15dc.jpg",
                caption: `Details Image`,
            });
            req.write(postData);
            req.end();

            console.log(req.body);
            res.status(200).end();
        }

        //messageFrom=req.body['data']['from'] // sender number
        //messageMsg=req.body['data']['body'] // Message text
        function invalidBot() {
            var options = {
                method: "POST",
                hostname: "api.ultramsg.com",
                port: null,
                path: "/instance77326/messages/chat",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            };

            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            });
            var postData = qs.stringify({
                token: "tz4c7nm9r4luh6i4",
                //"to": "120363158438640142@g.us",
                to: to,
                body: `Invalid Option`,
            });
            req.write(postData);
            req.end();

            console.log(req.body);
            res.status(200).end();
        }
        res.status(200).end();
    } catch (err) {
        console.log(err);
    }
};
//-----------------------------------------

exports.schedulerSave = async (req, res) => {
    try {
        let dataObj = req.body;
        //console.log(dataObj);
        let toDataNumbers = dataObj.to;
        //console.log(toDataNumbers);
        const client = await MongoClient.connect(url);
        const db = client.db("WASender");

        for (let i = 0; i < toDataNumbers.length; i++) {
            let data;

            if (dataObj.type === "chat") {
                data = {
                    token: `${dataObj.from.token}`,
                    instanceID: `${dataObj.from.instanceID}`,
                    to: `+${toDataNumbers[i].number}`,
                    body: `${dataObj.body}`,
                    type: `${dataObj.type}`,
                    date: `${dataObj.schdate}`,
                    status: "pending",
                };
            } else if (dataObj.type === "contact") {
                data = {
                    token: `${dataObj.from.token}`,
                    instanceID: `${dataObj.from.instanceID}`,
                    to: `+${toDataNumbers[i].number}`,
                    contact: `${dataObj.body}@c.us`,
                    type: `${dataObj.type}`,
                    date: `${dataObj.schdate}`,
                    status: "pending",
                };
            } else if (dataObj.type === "document") {
                console.log(dataObj.fileName);
                data = {
                    token: dataObj.from.token,
                    instanceID: `${dataObj.from.instanceID}`,
                    to: `+${toDataNumbers[i].number}`,
                    filename: dataObj.fileName,
                    document: dataObj.file,
                    caption: dataObj.body,
                    type: `${dataObj.type}`,
                    date: `${dataObj.schdate}`,
                    status: "pending",
                };
            } else if (dataObj.type === "image") {
                data = {
                    token: `${dataObj.from.token}`,
                    instanceID: `${dataObj.from.instanceID}`,
                    to: `+${toDataNumbers[i].number}`,
                    image: `${dataObj.file}`,
                    caption: `${dataObj.body}`,
                    type: `${dataObj.type}`,
                    date: `${dataObj.schdate}`,
                    status: "pending",
                };
            } else if (dataObj.type === "video") {
                data = {
                    token: `${dataObj.from.token}`,
                    instanceID: `${dataObj.from.instanceID}`,
                    to: `+${toDataNumbers[i].number}`,
                    video: `${dataObj.file}`,
                    caption: `${dataObj.body}`,
                    type: `${dataObj.type}`,
                    date: `${dataObj.schdate}`,
                    status: "pending",
                };
            } else if (dataObj.type === "audio") {
                data = {
                    token: `${dataObj.from.token}`,
                    instanceID: `${dataObj.from.instanceID}`,
                    to: `+${toDataNumbers[i].number}`,
                    audio: `${dataObj.file}`,
                    type: `${dataObj.type}`,
                    date: `${dataObj.schdate}`,
                    status: "pending",
                };
            } else if (dataObj.type === "location") {
                data = {
                    token: `${dataObj.from.token}`,
                    instanceID: `${dataObj.from.instanceID}`,
                    to: `+${toDataNumbers[i].number}`,
                    address: `${dataObj.body}`,
                    lat: `${dataObj.lat}`,
                    lng: `${dataObj.lng}`,
                    type: `${dataObj.type}`,
                    date: `${dataObj.schdate}`,
                    status: "pending",
                };
            }

            await db.collection("scheduled_messages").insertOne(data);
        }

        await client.close();
        res.json({
            msgArr: "Messages Scheduled",
        });
    } catch (err) {
        console.log(err);
    }
};
