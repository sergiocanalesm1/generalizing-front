import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';
import { setUser } from '../../utils/user';

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

function AuthModal( { open, onClose } ) {
    
    //TODO implement errors

    const [email,setEmail] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const [isLogin,setIsLogin] = useState(true);
    const [signupOrSignText,setSignupOrSignText] = useState('');
    const [footText, setFootText] = useState('');

    useEffect(()=>{
        if( isLogin ) {
            setSignupOrSignText('Log in');
            setFootText("Don't have an account? Sign Up");
        }
        else{
            setIsLogin(false)
            setSignupOrSignText('Sign Up');
            setFootText('Already have an Account? Log in');
        }

    },[isLogin]);

    const handleSubmit = useCallback( async() => {
        
        let response;

        if( !isLogin ) {
            const url = `${process.env.REACT_APP_API_URL}users/`;
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

        else { //login
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
            const user = await response.json();
            const userToSet = {
                id: user['id'] ,
                uuid: user['uuid']
            }
            setUser( userToSet );
        }
        onClose()
      }, [email, password, isLogin, username, onClose]);
    

    return(
        <Modal
            open={open}
            onClose={onClose}
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
                    { !isLogin &&
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
                    <Grid item>
                        <Typography variant='small'>
                            <Button 
                                variant="text"
                                size="small"
                                onClick={()=>{
                                    setIsLogin(!isLogin)
                                }}
                            >{footText}</Button>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

export default AuthModal;