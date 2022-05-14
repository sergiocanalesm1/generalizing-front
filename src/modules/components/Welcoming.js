//https://generalizing-test-bucket.s3.us-east-2.amazonaws.com/generalizing.png

import { Button, Card, CardActions, CardContent, CardMedia, Dialog, Stack, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lessonPath } from "../../utils/paths";
import AuthModal from "./AuthModal";
import FeedbackDialog from "./FeedbackDialog";
import HelpDialog from "./HelpDialog";

function WelcomingDialog({open,onClose}){

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
                <Card sx={{overflow: 'auto'}}>
                    <CardMedia
                        component="img"
                        height="50%"
                        image="https://generalizing-test-bucket.s3.us-east-2.amazonaws.com/generalizing.png"
                        alt="generalizing"
                    />
                    <CardContent>
                        <br/>
                        <Stack 
                            direction="row"
                            justifyContent="center"
                        >
                            <Typography variant="h4">Welcome to Generalizing</Typography>
                        </Stack>
                        <Stack 
                            direction="row"
                            justifyContent="center"
                        >
                            <Typography variant="body">Get more creative and have fun!</Typography>
                        </Stack>
                        <Toolbar  />
                        <Typography variant="body">
                        • Add <em>Lessons</em> you have learned and that you find cool from your everyday life.
                            <br />
                        • Create <em>Relations</em> between lessons any way you see fit! (get creative, there is no incorrect relation)
                            <br />
                        </Typography>

                    </CardContent>
                    <Stack direction="row" justifyContent="flex-end">
                        <CardActions>
                            <Button onClick={onClose} color="primary">
                                WTF
                            </Button>
                            <Button onClick={()=>setOpenAuthModal(true)} color="primary">
                                Sign up and add a lesson!
                            </Button>
                        </CardActions>
                    </Stack>
                </Card>
            </Dialog>
            <FeedbackDialog
                success={success}
                open={openFeedbackDialog}
                onClose={()=>{
                    setOpenFeedbackDialog(false)
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
                    navigate(lessonPath);
                    onClose();
                }}
                onError={()=>{
                    setSuccess(false);
                    setOpenFeedbackDialog(true);
                }}
            />
        </div>
    )
}

export default WelcomingDialog;