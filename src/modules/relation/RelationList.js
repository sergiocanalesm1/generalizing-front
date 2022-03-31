import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { toDate } from "../../utils/dates";
import { stringAvatar } from "../../utils/randoms";
import RelationDetailCard from "./RelationDetail";

const styles = {
    relationList:{ 
        width: '100%',
        maxWidth: 500,
        bgcolor: 'background.paper'
    },
    relationListItem:{
        '&:hover': {
            opacity:"0,5"
        }
    }
};

function RelationListDialog({open, setOpen, onClose, relations, filters}) {

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedRelation, setSelectedRelation] = useState();


    const handleOpenDetail = useCallback(( relation )=>{
        setOpen(false);
        setSelectedRelation(relation);
        setOpenDetail(true);
    },[setOpen]);

    const handleDetailClose = useCallback(()=>{
        setOpenDetail(false);
        setOpen(true);
    },[setOpen])
    

    return(
        <div>
            <Dialog
                scroll="paper"
                open={open}
                onClose={onClose}
                fullWidth
            >
                <DialogTitle>
                    <div>
                        <Typography variant="h3">
                            View Relations
                        </Typography>
                        { filters &&
                            <Typography variant="small" >
                                Filtering by: {filters}
                            </Typography>
                        }
                        
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <List sx={styles.relationList}>
                        {/**/}
                        { relations.map((r)=>(
                            <ListItemButton
                                disableGutters
                                key={r.id}
                                sx={styles.relationListItem}
                                onClick={()=>handleOpenDetail(r)}
                            >
                                <ListItemAvatar>
                                    <Avatar {...stringAvatar(r.name)} />
                                </ListItemAvatar>
                                <ListItemText  primary={r.name} secondary={toDate(r.creation_date)}/>
                            </ListItemButton>
                        ))
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullWidth
                open={openDetail}
                onClose={handleDetailClose}
            >
                <RelationDetailCard
                    relation={selectedRelation}
                    setOpen={setOpenDetail}

                />
            </Dialog>
        </div>
    )
}

export default RelationListDialog;