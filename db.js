const { MongoClient, ServerApiVersion } = require("mongodb");
const url =
	"mongodb+srv://subin:Password@cluster0.tvgqpfe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client, db;

async function connectToDatabase() {
	try {
		if (!client) {
			client = await MongoClient.connect(url);
			db = client.db("WASender");
			console.log("Connected to mongodb");
		}
		return db;
	} catch (error) {
		console.log(error);
	}
}

async function closeDatabaseConnection() {
	try {
		if (client) {
			await client.close();
			console.log("Mongodb disconnected");
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = { connectToDatabase, closeDatabaseConnection };
