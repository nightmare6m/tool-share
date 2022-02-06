const { ApolloServer } = require('apollo-server');
const { unusedFragMessage } = require('graphql/validation/rules/NoUnusedFragments');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const myTools = [
    {
        id: "123",
        description: "Hammer Drill",
        category: "123",
        quantity: 1
    }
]
const users = [

];


const typeDefs = `
  type Query {
    myTools: [Tool!]!
  }

  type Mutation {
      createTool(description: String!, category: ID!, quantity: Int!): ToolMutationResponse!
      updateTool(id:ID!, description: String!, category: ID!, quantity: Int!): ToolMutationResponse!
      deleteTool(id: ID!): ToolMutationResponse!
      signup(email: String!, password: String!, name: String!): AuthResponse
      login(email: String!, password: String!): AuthResponse
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

  type AuthResponse {
    token: String
    user: User
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
  }

`


const resolvers = {
  Query: {
    myTools: (parent, args, context) => {
      return myTools;
    }
  },
  Mutation:{
    createTool: (parent, args) => {
        const newTool = {
            id: "12-" + myTools.length.toString(),
            description: args.description,
            category: args.category,
            quantity: args.quantity
        }
        myTools.push(newTool);
        return {
            tool: newTool,
            errorCode: null,
            message: "Tool Created"
        };
    },
    updateTool: (parent, args) => {
      const newTool = myTools.find(tool => tool.id === args.id);
      newTool.description=args.description;
      newTool.category=args.category;
      newTool.quantity=args.quantity;
      return {
          tool: newTool,
          errorCode: null,
          message: "Tool Updated"
      };
    },
    deleteTool: (parent, args) => {
      const newTool = myTools.find(tool => tool.id === args.id);
      myTools.splice(myTools.indexOf(newTool), 1);
      return {
          tool: newTool,
          errorCode: null,
          message: "Tool Deleted"
      };
    },
    signup: (parent, args, context, info) => {
      const user = {
        id: users.length + 1,
        name: args.name,
        email: args.email
      }
      users.push({...user, ...{
        password: args.password
      }})
      return {
        token:uuidv4(),
        user
      }
    },
    login: (parent, args, context, info) => {
      const user = users.find(u => u.email === args.email);
      if (!user) {
        throw new Error('No such user found')
      }
      const valid = user.password == args.password;
      if (!valid) {
        throw new Error('Invalid password')
      }
  
      return {
        token:uuidv4(),
        user
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

function getUserId(req) {
  console.log("1")
  if (req) {
    console.log("2")
    const authHeader = req.headers.authorization;
    if (authHeader) {
      console.log("3")
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      return token;
    }
    else{
      console.log("4")
      throw new Error('No auth header');
    }
  } 

  throw new Error('Not authenticated');
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      accessToken: req.headers.authorization
    };
  }
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );