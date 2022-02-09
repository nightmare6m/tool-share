const { ApolloServer } = require('apollo-server');
require('dotenv').config();

const {typeDefs} = require('./schema');
const {context} = require('./context');
const {resolvers} = require('./resolvers');



const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );