import React, { useState, useEffect } from 'react'
import { Avatar, Paper, Grid, Typography, Container, Button } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from './styles.js'
import Input from './Input.js'
import { GoogleLogin } from 'react-google-login'
import Icon from './icon.js'
import { gapi } from 'gapi-script'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signin, signup } from '../../actions/auth.js'

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const classes = useStyles()
  const dispatch = useDispatch()
  const navigation = useNavigate()

  useEffect(() => {
    function start () {
      gapi.client.init({
        clientId: '404144324105-9rre3aubjj2smmlmn84mb7kvdud2bcaf.apps.googleusercontent.com',
        scope: 'email'
      })
    }

    gapi.load('client:auth2', start)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isSignUp) {
      dispatch(signup(formData, navigation))
    } else {
      dispatch(signin(formData, navigation))
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp)
    setShowPassword(false)
  }

  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

  const googleSuccess = async (res) => {
    const result = res?.profileObj
    const token = res.tokenId

    try {
      dispatch({ type: 'AUTH', data: { result, token } })

      navigation('/')
    } catch (error) {

    }
  }
  const googleFailure = (error) => {
    console.log(error)
    console.log('Google Sign In was unsuccessful. Try again later')
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5'>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus xs={6} half />
                <Input name='lastName' label='Last Name' handleChange={handleChange} autoFocus xs={6} half />
              </>
            )}
            <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
            <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            {isSignUp && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password' />}
          </Grid>
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <GoogleLogin
            clientId='404144324105-9rre3aubjj2smmlmn84mb7kvdud2bcaf.apps.googleusercontent.com'
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color='primary'
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant='contained'
              >Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy='single_host_origin'
          />
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp ? 'Already have an account? Please Sign In' : 'Don\'t have an account? Sign Up!'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth
