import Head from 'next/head'
import Image from 'next/image'
import {useQuery, gql, useMutation} from '@apollo/client';
import Router from 'next/router'
import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from '../styles/Home.module.css'

const GET_MY_TOOLS = gql`
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
const CREATE_TOOL = gql`
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
const DELETE_TOOL = gql`
mutation deleteTool ($id: ID!){
  deleteTool(id: $id){
    message,
    errorCode,
    toolId
  }
}
`;

const categories = [
  {
    id: "POWER",
    name: "Power Tools"
  },
  {
    id: "OTHER",
    name: "Other"
  }
]

function ToolCreate(props){
  const [toolCategory, setCategory] = useState("OTHER");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);


  return (<div>
    <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              autoFocus
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e)=>setQuantity(e.target.value)}
            />
            <Select
              value={toolCategory}
              label="Category"
              onChange={(e)=> setCategory(e.target.value)}
            >{
              categories.map(category => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))
            }
        </Select>
            <Button
              onClick={()=>{
                props.createTool(description, toolCategory, quantity);
                setDescription("");
                setQuantity(0);
                setCategory("OTHER");
              }}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Tool
            </Button>
  </div>);

}


export default function Home() {

  const token = typeof window !== "undefined" && localStorage.getItem('accessToken')?localStorage.getItem('accessToken'): "";
  if(typeof window !== "undefined" && !token){
    Router.push('/login')
  }
  const [createToolMutation, { createToolData, createToolLoading, createToolError }] = useMutation(CREATE_TOOL, {
    context: {
        headers: {
            "Authorization": "Bearer " + token
        }
    },
    update: (cache, {data}) => {
      const myTools = cache.readQuery({
        query: GET_MY_TOOLS
      }).myTools;
      const newTool ={
        id: data.createTool.tool.id,
        description: data.createTool.tool.description,
        category: data.createTool.tool.category,
        quantity: data.createTool.tool.quantity
      }
      cache.writeQuery({
        query: GET_MY_TOOLS,
        data: {myTools: {
          tools: myTools.tools.concat([newTool]),
          errorCode: null,
          message: "" 
        }}
      });      
    }
  });
  const [deleteToolMutation, { deleteToolData, deleteToolLoading, deleteToolError }] = useMutation(DELETE_TOOL, {
    context: {
        headers: {
            "Authorization": "Bearer " + token
        }
    },
    update: (cache, {data}) => {
      const myTools = cache.readQuery({
        query: GET_MY_TOOLS
      }).myTools;
      cache.writeQuery({
        query: GET_MY_TOOLS,
        data: {myTools: {
          tools: myTools.tools.filter(tool => tool.id !== data.deleteTool.toolId),
          errorCode: null,
          message: "" 
        }}
      });      
    }
  });
  const {loading, error, data} = useQuery(GET_MY_TOOLS, {
    context: {
        headers: {
            "Authorization": "Bearer " + token
        }
    }
});
  if(loading){
    return "loading";
  }
  if(error){
    return "error";
  }
  console.log(data);
 
  async function createTool(description, category, quantity){
    await createToolMutation({
      variables: {
        input: {
          description,
          category,
          quantity
        }
      }
    });
  }
  async function deleteTool(id){
    await deleteToolMutation({
      variables: {
        id
      }
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <ToolCreate createTool={createTool} />
      </div>
      <div>
        {data.myTools.tools.map(tool => (
          <Card key={tool.id} sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {tool.description}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {categories.find(category => category.id === tool.category).name}
            </Typography>
            <Typography variant="body2">
              {tool.quantity}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={()=>deleteTool(tool.id)} size="small">Delete</Button>
          </CardActions>
        </Card>
        ))}
      </div>
      
    </div>
  )
}
