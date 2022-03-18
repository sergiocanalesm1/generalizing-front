import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { AddCircleOutline } from '@mui/icons-material';

  
  function Home() {
    const drawerWidth = 240;

    const styles = {
        drawer : {
            width: drawerWidth,
            position: "relative",
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
          }
        }
    }
    return (
        <Box>
            {/*<Drawer
                variant="permanent"
                anchor="left"
                sx={styles.drawer}
            >
                <List>
                    <ListItem button key={"CREATE_RELATIONSHIP"}>
                        <ListItemIcon>
                            <AddCircleOutline />
                        </ListItemIcon>
                        <ListItemText primary={"Create Relationship"} />
                    </ListItem>
                </List>
            </Drawer>
            <Box>

            </Box>*/}
        </Box>
      
    );
  }
  
  
  
  export default Home;