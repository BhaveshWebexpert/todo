import http from 'http';
import app from './index.js'
import mongoose from 'mongoose';
import db_url from './config/ServerFileEnv.js'
 
const server = http.createServer(app);

mongoose.connect(db_url.connectionURL)
    .then(()=>{console.log("Mongoose connection established")})
    .catch(()=>{console.log("DB connection error")});

server.listen(3000);