import { useHookstate } from "@hookstate/core";
import { Delete, Edit } from "@mui/icons-material";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { dbState, filtersState, filterTypeState, relationsState, relationsToListState, updatingOrCreatingObjectState, userState } from "../../globalState/globalState";
import { deleteRelation } from "../../services/relations_services";
import { toDate } from "../../utils/dates";
import { relationPath } from "../../utils/paths";
import { stringAvatar } from "../../utils/strings";
import ConfirmModal from "../components/ConfirmModal";
import FeedbackDialog from "../components/FeedbackDialog";
import RelationDetailDialog from "./RelationDetail";
// Import { shuffle, sortByLatest, sortByOwned } from "../../utils/filters";

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
Const relationsSortObj = {
    random: "RANDOM",
    mine: "MINE",
    latest: "LATEST"
}
*/


function RelationListDialog({open, setOpen, onClose}) {

    const navigate = useNavigate();

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedRelation, setSelectedRelation] = useState();
    // Const [relationsSort, setRelationsSort] = useState( relationsSortObj.random );
    // const [proxyRelations, setProxyRelations] = useState([]);

    const user = useHookstate(userState);
    const relationsToList = useHookstate(relationsToListState);
    const relations = useHookstate(relationsState);
    const fbDB = useHookstate(dbState);
    const updatingObject = useHookstate(updatingOrCreatingObjectState);
    const filterType = useHookstate(filterTypeState);
    const filters = useHookstate(filtersState);

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

    const handleEdit = useCallback(( relation, id ) =>  {
        setOpen(false);
        updatingObject.set({
            object: {
                ...relation,
                id
            },
            updating: true
        });
        navigate( relationPath );
    },[navigate,setOpen,updatingObject])

    const handleDelete = useCallback(( id ) =>  {
        setOpenConfirmModal(true);
        setConfirmCallback( () => () => {
            deleteRelation(fbDB.get(), id )
                .then( ok => {
                    if( !ok ){
                        setSuccess(false);
                    }

                    setOpenConfirmModal(false);
                    setOpenFeedbackDialog(true);
                    if( ok ){
                        navigate(0);//!
                    }
                }
            )}
        );
    },[fbDB, navigate])

    /*
    Const handleRelationsSortClick = useCallback((criteria) => {
        setRelationsSort(relationsSortObj[criteria]);
        if( relationsSortObj[criteria] === relationsSortObj.random ){
            shuffle(relationsToList);
        }
        if( relationsSortObj[criteria] === relationsSortObj.mine ){
            relationsToList.sort(sortByOwned);//cache
        }
        if( relationsSortObj[criteria] === relationsSortObj.latest ){
            relationsToList.sort(sortByLatest);//cache
        }
        setProxyRelations(relationsToList);
    },[relationsToList])
    */

    const handleClose = useCallback(()=>{
        // SetRelationsSort(relationsSortObj.random);
        onClose()
    },[onClose])

    // UseEffect(()=>{setProxyRelations(relationsToList);},[relationsToList])

    // if( !relationsToList.get() ){return <></>;}

    return(
        <div>
            <Dialog
                fullWidth
                scroll="paper"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    <div>
                        <Typography variant="h3">
                            View Relations
                        </Typography>
                        { filters.get() &&
                            <Typography variant="small" >
                                Filtering by {filterType.get()}: {filters.get()}
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
                        {  relationsToList.get().map( id => {
                            const relation = relations.get()[id];
                            return (
                                <Grid
                                    key={`${id},${id}`}
                                    container
                                    spacing={3}
                                    alignItems="center"
                                >
                                    <Grid item xs={10}>
                                        <ListItemButton
                                            key={id}
                                            disableGutters
                                            sx={styles.relationListItem}
                                            onClick={()=>handleOpenDetail(relation)}
                                        >
                                            <ListItemAvatar>
                                                {/* TODO validate if file is img */}
                                                {
                                                    relation.fileName
                                                    ? <Avatar src={`${process.env.REACT_APP_BUCKET}/${relation.fileName}`} />
                                                    : <Avatar {...stringAvatar(relation.title)} />
                                                }
                                                
                                            </ListItemAvatar>
                                            <ListItemText  primary={relation.title} secondary={toDate(relation.creationDate)}/>
                                        </ListItemButton>
                                    </Grid>
                                    {
                                        relation.userUid === user.get().uid &&
                                            <Grid item xs={2}>
                                                <IconButton
                                                    edge="end" 
                                                    sx={{ color: 'gray' }}
                                                    onClick={() => handleEdit(relation, id)}
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
                        )})
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