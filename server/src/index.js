const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools')
const { constraintDirective, constraintDirectiveTypeDefs } = require('graphql-constraint-directive')
require('dotenv').config();

const {typeDefs} = require('./schema');
const {context} = require('./context');
const {resolvers} = require('./resolvers');
const {formatError} = require('./errors');

let schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
  resolvers
})
schema = constraintDirective()(schema)




const server = new ApolloServer({
  schema,
  context,
  formatError
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );