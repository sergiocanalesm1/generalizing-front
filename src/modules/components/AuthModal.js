import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Grid, Modal, Stack, TextField, Typography } from '@mui/material';
import { login, resetPassword, sendVerification, signin, signinWithGoogle } from '../../services/user_services';

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
    },
    googleImg:{
        width:"40%",
    }
    
  };

function AuthModal( { open, onClose, onSuccess, onError } ) {
    
    //TODO implement errors

    const [userForm, setUserForm] = useState({
        email:"",
        password:""
    })

    const [isLogin,setIsLogin] = useState(false);
    const [submitText,setSubmitText] = useState('');
    const [footText, setFootText] = useState('');

    const [fetching, setFetching] = useState(false);

    const [forgotPassword, setForgotPassword] = useState(false);

    useEffect(()=>{
        if( open ){
            if( forgotPassword ){
                setSubmitText('Reset Password');
            }
            else if( isLogin ) {
                setSubmitText('Log in');
                setFootText("Don't have an account? Sign Up");
            }
            else{
                setIsLogin(false)
                setSubmitText('Sign Up');
                setFootText('Already have an Account? Log in');
            }
        }

    },[isLogin, open, forgotPassword]);

    const handleChange = useCallback( e => {
        setUserForm({
            ...userForm,
            [e.target.name] : e.target.value
        })
    },[userForm])


    const handleSubmit = useCallback( async() => {
        setFetching(true);
        if( forgotPassword ){
            resetPassword(userForm.email,onSuccess,onError)
        }
        else if( isLogin ) {
            login(userForm.email,userForm.password,onSuccess,onError)
        }
        else {
            signin(userForm.email,userForm.password,onSuccess,onError)
            .then( () => {
                sendVerification();
            })
        }

        setFetching(false);
      }, [userForm, isLogin,forgotPassword,onSuccess,onError]);
    

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
                        <h4 align='center'> {submitText} to start relating!</h4>
                    </Grid>
                    <Grid item sx={style.modalItem}>
                        <TextField 
                            variant="outlined"
                            label="Email"
                            name="email"
                            required
                            onChange={ e => handleChange(e) }
                        />
                    </Grid>
                    { !forgotPassword &&
                        <Grid item sx={style.modalItem}>
                            <TextField 
                                variant="outlined"
                                label="Password"
                                required
                                type="password"
                                name="password"
                                onChange={ e => handleChange(e) }
                            />
                        </Grid>
                    }
                    <Grid item sx={style.modalItem}>
                    <Stack direction="row" alignItems="center" justifyContent="space-evenly">
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={(!userForm.email || !userForm.password)}
                        >
                            {submitText}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={()=>signinWithGoogle(onSuccess,onError)}
                            sx={style.googleImg}
                        >
                            <img 
                                src="https://raw.githubusercontent.com/firebase/firebaseui-web/master/image/google.svg"
                                alt="google_icon"
                                style={style.googleImg}
                            />
                        </Button>
                    </Stack>
                    </Grid>
                    <Grid item>
                        <Typography variant='small'>
                            <Button 
                                variant="text"
                                size="small"
                                onClick={()=>{
                                    setIsLogin(!isLogin)
                                    setForgotPassword(false);
                                }}
                                disabled={fetching}
                            >
                                {footText}
                            </Button>
                        </Typography>
                    </Grid>
                    { !forgotPassword &&
                        <Grid item>
                            <Typography variant='small'>
                                <Button 
                                    variant="text"
                                    size="small"
                                    onClick={()=>{
                                        setForgotPassword(true)
                                    }}
                                    disabled={fetching}
                                >
                                    Forgot your password
                                </Button>
                            </Typography>
                        </Grid>
                    }
                </Grid>
            </Box>
        </Modal>
    );
}

export default AuthModal;