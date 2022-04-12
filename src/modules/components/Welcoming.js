//https://generalizing-test-bucket.s3.us-east-2.amazonaws.com/generalizing.png

import { Button, Card, CardActions, CardContent, CardMedia, Dialog, Stack, Toolbar, Typography } from "@mui/material";

function WelcomingDialog({open,onClose}){
    return(
    <Dialog
        scroll="paper"
        open={open}
        onClose={onClose}
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
                • Add <strong>lessons</strong> you have learned and that you find cool from your everyday life.
                    <br />
                • Create <strong>relations</strong> between lessons any way you see fit! (get creative, there is no incorrect relation)
                    <br />
                • Explore lessons and relations created by other users and feel free to use them
                </Typography>

            </CardContent>
            <Stack direction="row" justifyContent="flex-end">
                <CardActions>
                    <Button onClick={onClose} color="primary">
                        Start!
                    </Button>
                </CardActions>
            </Stack>
        </Card>
    </Dialog>
    )
}

export default WelcomingDialog;