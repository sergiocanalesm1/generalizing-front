//https://generalizing-test-bucket.s3.us-east-2.amazonaws.com/generalizing.png

import { Button, Card, CardActions, CardContent, CardMedia, Dialog, Grid, Stack, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
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
                scroll="paper"
                open={open}
                fullWidth
            >
                <Card sx={{
                    overflow: 'auto',
                    p:3,
                    pr:4
                }}>

                    <Stack 
                        direction="row"
                        justifyContent="center"
                    >
                            <Typography variant="h3">Welcome to Generalizing!</Typography>
                    </Stack>
                    <CardMedia
                        component="img"
                        image="https://generalizing-test-bucket.s3.us-east-2.amazonaws.com/relations.png"
                        alt="generalizing"
                    />
                    <CardContent>
                        <Stack 
                            direction="row"
                            justifyContent="center"
                        >
                            <Typography variant="body">Add <em>Lessons</em> and create <em>Relations</em> to get more creative</Typography>
                        </Stack>

                    </CardContent>
                        <Grid container>
                        <Grid item xs={12} md={6}>
                            <CardActions>
                                <Button onClick={()=>setOpenHelpDialog(true)} color="primary">
                                    WTF, i need more info
                                </Button>
                            </CardActions>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack direction="row" justifyContent="flex-end">
                                <CardActions>
                                    <Button onClick={()=>setOpenAuthModal(true)} color="primary">
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
            <HelpDialog
                open={openHelpDialog}
                onClose={()=>setOpenHelpDialog(false)}
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
                onClose={()=>setOpenHelpDialog(false)}
                lessons={lessons}
                relations={relations}
            />
        </div>
    )
}

export default WelcomingDialog;