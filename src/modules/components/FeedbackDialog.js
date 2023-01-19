import React from 'react';
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";

function FeedbackDialog( {success, open, onClose } ){
    return(
        <Dialog
            open={open}
            scroll="paper"
            onClose={onClose}
        >
            <DialogTitle sx={{minWidth:300}}>
                <div>
                    {success
                        ?   <Typography variant="h4" color="success">
                                Success!
                            </Typography>
                        :   <Typography variant="h4" color="error">
                                Error
                            </Typography>
                    }
                </div>
            </DialogTitle>
            <DialogContent dividers>
                <Stack direction="row" justifyContent="center" sx={{p:4}}>
                    {success
                     ? <CheckCircleOutline color="primary" sx={{width:100,height:100}}/>
                     : <ErrorOutline sx={{width:100,height:100}} />  
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default FeedbackDialog;