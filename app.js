const express = require('express');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolver = require('./graphql/resolver/index');

const app = express();

app.use(express.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema:graphQlSchema,
    rootValue:graphQlResolver,
    graphiql: true
  })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-jkddc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() =>{
    app.listen(3000);
  }).catch(err => {
    console.log(err);
  });
