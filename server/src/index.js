const { ApolloServer } = require('apollo-server');
const { unusedFragMessage } = require('graphql/validation/rules/NoUnusedFragments');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();


const Auth = require('./firebase/auth');
const Firestore = require('./firebase/firestore');



const typeDefs = `
  type Query {
    myTools: [Tool!]!
  }

  type Mutation {
      createTool(description: String!, category: ID!, quantity: Int!): ToolMutationResponse!
      updateTool(id:ID!, description: String!, category: ID!, quantity: Int!): ToolMutationResponse!
      deleteTool(id: ID!): ToolMutationResponse!
      signup(email: String!, password: String!, name: String!): SignUpResponse
      login(email: String!, password: String!): LoginResponse
  }

  type Tool {
      id: ID!
      description: String!
      category: ID!
      quantity: Int!
  }

  type ToolMutationResponse {
      tool: Tool,
      message: String!,
      errorCode: Int
  }

  type SignUpResponse {
    message: String!
    errorCode: Int
  }
  type LoginResponse {
    token: String
    name: String
    message: String!
    errorCode: Int
  }

`


const resolvers = {
  Query: {
    myTools: async (parent, args, context) => {
      if(!context.currentUser){
        return [];
      }
      const myToolsDoc = await Firestore.getDocument(context.currentUser.user_id);
      return myToolsDoc?myToolsDoc.tools:[];
    }
  },
  Mutation:{
    createTool: async (parent, args, context) => {
        if(!context.currentUser){
          return {
            errorCode: 401,
            message: "User Not Logged In"
          };
        }
        const newTool = {
            id: uuidv4(),
            description: args.description,
            category: args.category,
            quantity: args.quantity
        }
        
        const myToolsDoc = await Firestore.getDocument(context.currentUser.user_id); 
        if(!myToolsDoc){
          await Firestore.setDocument(context.currentUser.user_id, {tools:[newTool]});
        }
        else{
          await Firestore.setDocument(context.currentUser.user_id, {tools:myToolsDoc.tools.concat([newTool])});
        }
        return {
            tool: newTool,
            errorCode: null,
            message: "Tool Created"
        };
    },
    updateTool: async (parent, args, context) => {
      if(!context.currentUser){
        return {
          errorCode: 401,
          message: "User Not Logged In"
        };
      }

      const myToolsDoc = await Firestore.getDocument(context.currentUser.user_id);
      const myTools = myToolsDoc.tools; 
      const newTool = myTools.find(tool => tool.id === args.id);
      newTool.description=args.description;
      newTool.category=args.category;
      newTool.quantity=args.quantity;

      await Firestore.setDocument(context.currentUser.user_id, {tools:myTools});

      return {
          tool: newTool,
          errorCode: null,
          message: "Tool Updated"
      };
    },
    deleteTool: async (parent, args, context) => {
      if(!context.currentUser){
        return {
          errorCode: 401,
          message: "User Not Logged In"
        };
      }

      const myToolsDoc = await Firestore.getDocument(context.currentUser.user_id);
      const myTools = myToolsDoc.tools; 
      const newTool = myTools.find(tool => tool.id === args.id);
      myTools.splice(myTools.indexOf(newTool), 1);
      await Firestore.setDocument(context.currentUser.user_id, {tools:myTools});
      return {
          tool: newTool,
          errorCode: null,
          message: "Tool Deleted"
      };
    },
    signup: async (parent, args, context, info) => {
      await Auth.createUser(args);
      return {
        message: "User Created"
      }
    },
    login: async (parent, args, context, info) => {
      const user = await Auth.signIn(args.email, args.password);
  
      return {
        token:  user.token,
        name: user.name,
        message: "Login Successful"
      }
    }
  },
  Tool:{
      id: (parent) => parent.id,
      description: (parent) => parent.description,
      category: (parent) => parent.category,
      quantity: (parent) => parent.quantity
  }
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
      return {};
    }
    const accessToken = authHeader.split("Bearer ")[1];
    if(!accessToken){
      return {};
    }
    try{
      const currentUser = await Auth.validateToken(accessToken);
    return {
      currentUser
    };
    }
    catch(e){
      return {};
    }
    
  }
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );