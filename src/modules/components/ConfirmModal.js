import React from 'react';
import { Button, Card, CardActions, CardContent, Dialog, Grid, Stack, Typography } from "@mui/material";

function ConfirmModal( {open, setOpen, callback} ){
    // This is currently only being used for deleting
    
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

                    
                    <CardContent>
                        <Typography variant="body">
                            Are you sure you want to delete this permanently?
                        </Typography>

                    </CardContent>
                    <Grid container justifyContent="center" alignItems="center">
                        <Grid item xs={12} md={6}>
                            <CardActions>
                                <Button color="primary" onClick={()=>setOpen(false)}>
                                    CLOSE
                                </Button>
                            </CardActions>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack direction="row" justifyContent="flex-end">
                                <CardActions>
                                    <Button color="warning" onClick={callback}>
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