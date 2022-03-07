import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export function ToolCard (props){
    return (
        <Card key={props.tool.id} sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {props.tool.description}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {props.categories.find(category => category.id === props.tool.category).name}
            </Typography>
            <Typography variant="body2">
              {props.tool.quantity}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={()=>props.deleteTool(props.tool.id)} size="small">Delete</Button>
            <Button onClick={()=>props.setUpdateId(props.tool.id)} size="small">Edit</Button>
          </CardActions>
        </Card>
    );
}