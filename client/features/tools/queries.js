import {gql} from '@apollo/client';

export const GET_MY_TOOLS = gql`
{
     myTools{
         tools{
          id,
          description,
          quantity,
          category
         }
         message,
         errorCode
       }
}
`;
export const CREATE_TOOL = gql`
mutation createTool ($input: CreateToolInput!){
  createTool(input: $input){
    message,
    errorCode,
    tool {
      id,
      description,
      category,
      quantity
    }
  }
}
`;
export const UPDATE_TOOL = gql`
mutation updateTool ($input: UpdateToolInput!){
  updateTool(input: $input){
    message,
    errorCode,
    tool {
      id,
      description,
      category,
      quantity
    }
  }
}
`;
export const DELETE_TOOL = gql`
mutation deleteTool ($id: ID!){
  deleteTool(id: $id){
    message,
    errorCode,
    toolId
  }
}
`;