import { Edit } from "@mui/icons-material";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toDate } from "../../utils/dates";
import { relationPath } from "../../utils/paths";
import { stringAvatar } from "../../utils/strings";
import { getUserId } from "../../utils/user";
import RelationDetailDialog from "./RelationDetail";
//import { shuffle, sortByLatest, sortByOwned } from "../../utils/filters";

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
    },
};

/*
const relationsSortObj = {
    random: "RANDOM",
    mine: "MINE",
    latest: "LATEST"
}
*/


function RelationListDialog({open, setOpen, onClose, relations, filterType, filters}) {

    const navigate = useNavigate();

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedRelation, setSelectedRelation] = useState();
    //const [relationsSort, setRelationsSort] = useState( relationsSortObj.random );
    //const [proxyRelations, setProxyRelations] = useState([]);


    const handleOpenDetail = useCallback(( relation )=>{
        setOpen(false);
        setSelectedRelation(relation);
        setOpenDetail(true);
    },[setOpen]);

    const handleDetailClose = useCallback(()=>{
        setOpenDetail(false);
        setOpen(true);
    },[setOpen])

    const handleEdit = useCallback(( relation ) =>  {
        setOpen(false);
        navigate( relationPath, {
            state:{ relation }
        })
    },[navigate,setOpen])

    /*
    const handleRelationsSortClick = useCallback((criteria) => {
        setRelationsSort(relationsSortObj[criteria]);
        if( relationsSortObj[criteria] === relationsSortObj.random ){
            shuffle(relations);
        }
        if( relationsSortObj[criteria] === relationsSortObj.mine ){
            relations.sort(sortByOwned);//cache
        }
        if( relationsSortObj[criteria] === relationsSortObj.latest ){
            relations.sort(sortByLatest);//cache
        }
        setProxyRelations(relations);
    },[relations])
    */

    const handleClose = useCallback(()=>{
        //setRelationsSort(relationsSortObj.random);
        onClose()
    },[onClose])

    useEffect(()=>{
        //setProxyRelations(relations);
    },[relations])

    return(
        <div>
            <Dialog
                scroll="paper"
                open={open}
                onClose={handleClose}
                fullWidth
            >
                <DialogTitle>
                    <div>
                        <Typography variant="h3">
                            View Relations
                        </Typography>
                        { filters &&
                            <Typography variant="small" >
                                Filtering by {filterType}: {filters}
                            </Typography>
                        }
                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                            {/*
                                Object.keys(relationsSortObj).map( rs => (
                                    <Button
                                        key={rs}
                                        sx={{ borderRadius: 28 }}
                                        size="small"
                                        color="neutral"
                                        variant={ relationsSortObj[rs] === relationsSort ? "contained" :"outlined" }
                                        disableElevation
                                        onClick={() => handleRelationsSortClick(rs) }
                                    >
                                        {relationsSortObj[rs]}    
                                    </Button>
                                ))
                                */}
                        </Stack>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <List sx={styles.relationList}>
                        { relations?.map((r)=>(
                            <Stack direction="row" justifyContent="flex-start" key={r.id}>
                                <ListItemButton
                                    disableGutters
                                    key={r.id}
                                    sx={styles.relationListItem}
                                    onClick={()=>handleOpenDetail(r)}
                                >
                                    <ListItemAvatar>
                                        {/* TODO validate if file is img */}
                                        {
                                            r.files.length > 0
                                            ? <Avatar src={r.files[0].file.split("?")[0]} />
                                            : <Avatar {...stringAvatar(r.name)} />
                                        }
                                        
                                    </ListItemAvatar>
                                    <ListItemText  primary={r.name} secondary={toDate(r.creation_date)}/>
                                </ListItemButton>
                                {
                                    r.user === getUserId() &&
                                    <IconButton
                                        edge="end" 
                                        sx={{ color: 'gray' }}
                                        onClick={() => handleEdit(r)}
                                    >
                                        <Edit />
                                    </IconButton>
                                }
                            </Stack>
                        ))
                        }
                        
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <RelationDetailDialog
                open={openDetail}
                relation={selectedRelation}
                setOpen={setOpenDetail}
                onClose={handleDetailClose}
            />
        </div>
    )
}

export default RelationListDialog;