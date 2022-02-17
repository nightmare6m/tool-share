const ToolService = require('./services/tools');
//const Firestore = require('./firebase/firestore');
const Auth = require('./firebase/auth');

function getAuthedResolver(next) {
    return async function(parent, args, context){
        if(!context.currentUser){
            return {
                errorCode: 401,
                message: "User Not Logged In"
              };
        }
        const result = await next(parent, args, context);
        return result;
    }
}

const resolvers = {
    Query: {
      myTools: getAuthedResolver(async (parent, args, context) => {

        const tools = await ToolService.getMyTools(context.currentUser.user_id);
        
        return {
            tools,
            message: "Tools Retrieved"
        };
      })
    },
    Mutation:{
      createTool: getAuthedResolver(async (parent, args, context) => {
          const tool = await ToolService.createTool(context.currentUser.user_id, args.input.description, args.input.category, args.input.quantity);
          return {
              tool,
              errorCode: null,
              message: "Tool Created"
          };
      }),
      updateTool: getAuthedResolver(async (parent, args, context) => {
        const tool = await ToolService.updateTool(context.currentUser.user_id, args.input.id, args.input.description, args.input.category, args.input.quantity);
    
        return {
            tool,
            errorCode: null,
            message: "Tool Updated"
        };
      }),
      deleteTool: getAuthedResolver(async (parent, args, context) => {
        await ToolService.deleteTool(context.currentUser.user_id, args.id);
        return {
            errorCode: null,
            message: "Tool Deleted",
            toolId: args.id
        };
      }),
      signup: async (parent, args, context, info) => {
        await Auth.createUser(args.input);
        return {
          message: "User Created"
        }
      },
      login: async (parent, args, context, info) => {
        const user = await Auth.signIn(args.input.email, args.input.password);
    
        return {
          token:  user.token,
          name: user.name,
          message: "Login Successful"
        }
      }
    }
  }

  module.exports = {
      resolvers
  }