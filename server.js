require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('express-jwt');
const startApolloServer = require('./config/apollo')
const typeDefs = require('./data/schema');
const resolvers = require('./data/resolvers');
const { default: axios } = require('axios');
const { response } = require('express');

mongoose.connect(process.env.MONGO_DB_URI);
const app = express();
// auth middleWare
const auth = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
    credentialsRequired: false
});

app.use(auth);


/* 

sample implementation of of email verification endpoint 
this would be done on the frontend facing application of this user service 

*/


app.get('/verify', (req, res) => {
    const email = req.query.email;
    const token = req.query.token;

    return axios.post(`${process.env.APP_URL}/graphql`, {
        query: `mutation {
            verify(email: "${email}", token: "${token}"){
                id
            }
        }`
    }).then((response) => {

        if (response.data.errors) {
            return res.status(400).send(response.data.errors[0].message)
        }

        return res.send(response.data.data);
    }).catch((error) => {
        return res.status(500).send({
            message: error.message
        });
    })
});

startApolloServer(typeDefs, resolvers, app);