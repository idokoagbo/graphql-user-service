require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('express-jwt');
const startApolloServer = require('./config/apollo')
const typeDefs = require('./data/schema');
const resolvers = require('./data/resolvers');

mongoose.connect(process.env.MONGO_DB_URI);
const app = express();
// auth middleWare
const auth = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
    credentialsRequired: false
});

app.use(auth);

startApolloServer(typeDefs, resolvers, app);