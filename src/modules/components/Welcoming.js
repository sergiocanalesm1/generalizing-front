import { Button, Card, CardActions, CardContent, CardMedia, Dialog, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lessonPath } from "../../utils/paths";
import { setFirstTimer } from "../../utils/user";
import AuthModal from "./AuthModal";
import FeedbackDialog from "./FeedbackDialog";
import HelpDialog from "./HelpDialog";

function WelcomingDialog( {open, lessons, relations} ){

    const navigate = useNavigate();

    const [success, setSuccess] = useState( false );
    const [openAuthModal, setOpenAuthModal] = useState( false );
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [openHelpDialog, setOpenHelpDialog] = useState( false );

    return(
        <div>
            <Dialog
                fullWidth
                scroll="paper"
                open={open}
            >
                <Card sx={{
                    overflow: 'auto',
                    p:3,
                }}>

                    <Stack 
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                            <Typography variant="h3" align="center">Welcome to Generalizing!</Typography>
                    </Stack>
                    <CardMedia
                        component="img"
                        image={`${process.env.REACT_APP_BUCKET}/relations.png`}
                        alt="generalizing"
                        sx={{pr:2}}
                    />
                    <CardContent>
                        <Stack 
                            direction="row"
                            justifyContent="center"
                        >
                            <Typography variant="body" align="center">Add <em>Lessons</em> and create <em>Relations</em> to get more creative</Typography>
                        </Stack>

                    </CardContent>
                        <Grid container justifyContent="center" alignItems="center">
                        <Grid item xs={12} md={6}>
                            <CardActions>
                                <Button color="primary" onClick={()=>setOpenHelpDialog(true)}>
                                    WTF, i need more info
                                </Button>
                            </CardActions>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack direction="row" justifyContent="flex-end">
                                <CardActions>
                                    <Button color="primary" onClick={()=>setOpenAuthModal(true)}>
                                        Ready to Sign up and start
                                    </Button>
                                </CardActions>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Dialog>
            <FeedbackDialog
                success={success}
                open={openFeedbackDialog}
                onClose={()=>{
                    setOpenFeedbackDialog(false)
                    if( success ){
                        setFirstTimer();
                        navigate(lessonPath);
                    }
                }}

            />

            <AuthModal
                open={openAuthModal}
                onClose={()=>{
                    setOpenAuthModal(false)
                }}
                onSuccess={()=>{
                    setOpenAuthModal(false)
                    setSuccess(true);
                    setOpenFeedbackDialog(true);
                    
                }}
                onError={()=>{
                    setSuccess(false);
                    setOpenFeedbackDialog(true);
                }}
            />
            <HelpDialog
                open={openHelpDialog}
                lessons={lessons}
                relations={relations}
                onClose={()=>setOpenHelpDialog(false)}
            />
        </div>
    )
}

export default WelcomingDialog;