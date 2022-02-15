const typeDefs = `
  type Query {
    myTools: ToolListResponse
  }
  
  type Mutation {
      createTool(input: CreateToolInput!): ToolMutationResponse!
      updateTool(input: UpdateToolInput!): ToolMutationResponse!
      deleteTool(id: ID!): ToolMutationResponse!
      signup(input: SignupInput!): SignUpResponse
      login(input: LoginInput!): LoginResponse
  }
  
  input SignupInput {
    email: String! @constraint(minLength: 5, maxLength: 50, format: "email")
    password: String! @constraint(minLength: 6, maxLength: 20, pattern: "^[0-9a-zA-Z!@]*$")
    name: String! @constraint(minLength: 2, maxLength: 50, pattern: "^[0-9a-zA-Z]*$")
  }
  input LoginInput {
    email: String! @constraint(minLength: 5, maxLength: 50, format: "email")
    password: String! @constraint(minLength: 6, maxLength: 20, pattern: "^[0-9a-zA-Z!@]*$")
  }
  input CreateToolInput{
    description: String! @constraint(minLength: 3, maxLength: 50, pattern: "^[0-9a-zA-Z]*$")
    category: ID!
    quantity: Int! @constraint(min: 0)
  }
  input UpdateToolInput{
    id:ID!
    description: String! @constraint(minLength: 3, maxLength: 50, pattern: "^[0-9a-zA-Z]*$")
    category: ID!
    quantity: Int! @constraint(min: 0)
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