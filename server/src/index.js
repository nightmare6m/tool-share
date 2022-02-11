const { ApolloServer } = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema')
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
  formatError,
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ]
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );