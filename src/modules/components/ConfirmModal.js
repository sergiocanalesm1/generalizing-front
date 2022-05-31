import { Button, Card, CardActions, CardContent, Dialog, Grid, Stack } from "@mui/material";

function ConfirmModal( {open, setOpen, callback} ){

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
                }}>

                    
                    <CardContent>


                    </CardContent>
                    <Grid container justifyContent="center" alignItems="center">
                        <Grid item xs={12} md={6}>
                            <CardActions>
                                <Button onClick={()=>setOpen(false)} color="primary">
                                    CLOSE
                                </Button>
                            </CardActions>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack direction="row" justifyContent="flex-end">
                                <CardActions>
                                    <Button onClick={callback} color="warning">
                                        DELETE
                                    </Button>
                                </CardActions>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Dialog>
        </div>
    )
}

export default ConfirmModal;