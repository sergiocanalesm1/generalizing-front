import { useHookstate } from "@hookstate/core";
import { Delete, Edit } from "@mui/icons-material";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userState } from "../../globalState/globalState";
import { deleteRelation } from "../../services/relations_services";
import { toDate } from "../../utils/dates";
import { relationPath } from "../../utils/paths";
import { stringAvatar } from "../../utils/strings";
import { getUserId } from "../../utils/user";
import ConfirmModal from "../components/ConfirmModal";
import FeedbackDialog from "../components/FeedbackDialog";
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


function RelationListDialog({open, setOpen, onClose,relations, filterType, filters}) {

    const navigate = useNavigate();

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedRelation, setSelectedRelation] = useState();
    //const [relationsSort, setRelationsSort] = useState( relationsSortObj.random );
    //const [proxyRelations, setProxyRelations] = useState([]);

    const user = useHookstate(userState);

    const [success, setSuccess] = useState(true);
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(()=>{});


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

    const handleDelete = useCallback(( id ) =>  {
        setOpenConfirmModal(true);
        setConfirmCallback( ( prevState ) => () => {
            deleteRelation( id )
                .then( ok => {
                    if( !ok ){
                        setSuccess(false);
                    }
                    setOpenConfirmModal(false);
                    setOpenFeedbackDialog(true);
                }
            )}
        );
    },[])

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

    if( !relations.get() ){
        return <></>;
    }

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
                        {  Object.keys(relations).map( id => (
                            relations.get()[id] && 
                            <Grid
                                key={id}
                                container
                                spacing={3}
                                alignItems="center"
                            >
                                <Grid item xs={10}>
                                    <ListItemButton
                                        disableGutters
                                        key={id}
                                        sx={styles.relationListItem}
                                        onClick={()=>handleOpenDetail(relations.get()[id])}
                                    >
                                        <ListItemAvatar>
                                            {/* TODO validate if file is img */}
                                            {
                                                relations.get()[id].fileName
                                                ? <Avatar src={`${process.env.REACT_APP_BUCKET}/${relations.get()[id].fileName}`} />
                                                : <Avatar {...stringAvatar(relations.get()[id].title)} />
                                            }
                                            
                                        </ListItemAvatar>
                                        <ListItemText  primary={relations.get()[id].title} secondary={toDate(relations.get()[id].creationDate)}/>
                                    </ListItemButton>
                                </Grid>
                                {
                                    relations.get()[id].userId === user.get().userId &&
                                        <Grid item xs={2}>
                                            <IconButton
                                                edge="end" 
                                                sx={{ color: 'gray' }}
                                                onClick={() => handleEdit(relations.get()[id])}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                edge="end" 
                                                sx={{ color: 'gray' }}
                                                onClick={() => handleDelete(id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Grid>
                                }
                            </Grid>
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
            <ConfirmModal
                open={openConfirmModal}
                setOpen={setOpenConfirmModal}
                callback={confirmCallback}
            />

            <FeedbackDialog
                success={success}
                open={openFeedbackDialog}
                onClose={()=>{
                    setOpenFeedbackDialog(false)
                    if( success ){
                        setOpen(false);
                    }
                }}
            />
        </div>
    )
}

export default RelationListDialog;