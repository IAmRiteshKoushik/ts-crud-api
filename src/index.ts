import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";

import router from './router';

const app = express();

// Things to figure out : Middleware layers
// CORS
// compression()
// cookieParser()
// bodyParser()

app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log("Server running on http://localhost:8080/");
});

const MONGO_URL = 'mongodb://localhost:27017/ts_testing_db';

mongoose.Promise = Promise;

// Handle initial connection error
mongoose.connect(MONGO_URL).
    catch((error: Error) => console.log(error));

// Handle errors after initial connection, listen for error events
// on the connection. You still need to handle the initial connection error 
// by writing the catch block for the connection.
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());
