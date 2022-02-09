const typeDefs = `
  type Query {
    myTools: ToolListResponse
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
  type ToolListResponse {
    tools: [Tool!],
    message: String!,
    errorCode: Int
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

module.exports = {
    typeDefs
}