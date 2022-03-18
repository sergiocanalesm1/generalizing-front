import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Grid, Modal, TextField } from '@mui/material';

const style = {
    modal :{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '5px',
        p: 2
    },
    modalItem:{
        p:1
    }
    
  };

function AuthModal( { open, setOpen, signup, login, setSignup, setLogin } ) {
    
    //TODO implement errors

    const [email,setEmail] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const [fetching,setFetching] = useState(false);

    const [signupOrSignText,setSignupOrSignText] = useState('');

    useEffect(()=>{
        if( signup ){
            setSignupOrSignText('Sign Up');
        }
        if( login ) {
            setSignupOrSignText('Log in');
        }
    },[login,signup]);

    const handleSubmit = useCallback( async() => {
        setFetching(true);
        
        let response;

        if( signup ) {
            const url = process.env.REACT_APP_API_URL + 'users/';
            response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password
                })
            })
        }

        if( login ) {
            const url = `${process.env.REACT_APP_API_URL}login/`;
            response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
        }
        if( response.ok ){
            localStorage.setItem( 'uuid', response.json()['uuid'] );
            console.log(localStorage.getItem('uuid'));
        }
        
        setFetching(false);
        setOpen(false);
      }, [email, login, password, signup, username, setOpen]);
    

    return(
        <Modal
            open={open}
            onClose={ () => {
                setOpen(false);
                setLogin(false);
                setSignup(false);
            } }
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style.modal}>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    direction="column"
                >
                    <Grid item sx={style.modalItem}>
                        <h4 align='center'> {signupOrSignText} to start relating!</h4>
                    </Grid>
                    { signup &&
                        <Grid item sx={style.modalItem}>
                            <TextField 
                                variant="outlined"
                                label="Username"
                                required
                                onChange={ (e) => setUsername(e.target.value) }
                                />
                        </Grid>  
                    }
                    <Grid item sx={style.modalItem}>
                        <TextField 
                            variant="outlined"
                            label="Email"
                            required
                            onChange={ (e) => setEmail(e.target.value) }
                        />
                    </Grid>
                    <Grid item sx={style.modalItem}>
                        <TextField 
                            variant="outlined"
                            label="Password"
                            required
                            type="password"
                            onChange={ (e) => setPassword(e.target.value) }
                        />
                    </Grid>
                    <Grid item sx={style.modalItem}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={(!email || !password)}
                        >
                            {signupOrSignText}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

export default AuthModal;