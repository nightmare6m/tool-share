import {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {CATEGORIES} from 'features/tools/constants';


export function ToolUpdate(props){
    const [toolCategory, setCategory] = useState("OTHER");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(0);
  
    useEffect(() => {
      setCategory(props.category);
    }, [props.category]);
    useEffect(() => {
      setDescription(props.description);
    }, [props.description]);
    useEffect(() => {
      setQuantity(props.quantity);
    }, [props.quantity]);
  
    return (
      <Dialog onClose={()=>props.cancelUpdate()} open={true}>
        <DialogTitle>Update Tool</DialogTitle>
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
                CATEGORIES.map(category => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))
              }
          </Select>
              <Button
                onClick={()=>{
                  props.updateTool(props.id, description, toolCategory, quantity);
                  setDescription("");
                  setQuantity(0);
                  setCategory("OTHER");
                }}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Save
              </Button>
    </Dialog>);
  
  }