import React, { useState, useEffect } from 'react'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import lightTheme from '@/themes/light'
import Copyright from '@/atoms/Copyright'
import CustomAvatar from '@/atoms/CustomAvatar'
import FormLogin from '@/molecules/FormLogin'
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormSignup from '@/molecules/FormSingup'
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router'


const useStyles = makeStyles((theme) => ({
    paper: {
        margin: 0,
        padding: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}))


const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});
  
const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!)	{
    login(input: {email: $email, password: $password}){
      token
    }
  }
`

const Login = () => {
  
  interface loginPayload {
    email: string
    password: string
  }
  interface loginResponse {
    login : {
      token: string
    }
  }
  const [login, {error, loading, data}] = useMutation<loginResponse, loginPayload>(LOGIN_MUTATION)
  
  const [open, setOpen] = React.useState(false);
  
  const router = useRouter()

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = async event => {
    event.preventDefault()
    const form = event.target
    const formData = new window.FormData(form)
    const email = formData.get('email') 
    const password = formData.get('password')
    form.reset()
    if(typeof email === 'string' && typeof password === 'string') {
      try {
        const {data} = await login({ variables: {email, password}})
        debugger
        if (data && data.login.token){
          localStorage.setItem('token', data.login.token)
          router.push('/')
        }
      } catch (error) {
        debugger
        console.log(error);
      }
    }
  }

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <ThemeProvider theme={lightTheme}>
            <CustomAvatar/>       
        <Typography component="h1" variant="h5">
          Inicio de Sesión
        </Typography>        
        <form 
            className={classes.form} 
            noValidate
            onSubmitCapture={handleLogin}
        >
          <TextField
            color='primary'
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Dirección de Email"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            color='primary'
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="secondary" />}
            label="Recordar constreseña"
            color='primary'
          />
          <Button
            color='primary'
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
          >
            Inicia Sesión
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" color='inherit' variant="body2">
                ¿Olvidaste la contraseña?
              </Link>
            </Grid>
            <Grid item>
              <Link onClick={() => props.Click()} color='inherit' variant="body2">
                {"Crear cuenta nueva"}
              </Link>                
            </Grid>
          </Grid>
        </form>
        <FormSignup Op={open} Trans={Transition} Close={handleClose}/>
        </ThemeProvider>
        <Box mt={8}>
        <Copyright />
        </Box>
      </div> 
    </Container>
  );
}

export default Login