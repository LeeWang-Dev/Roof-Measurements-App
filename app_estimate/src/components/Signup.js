import React, {useState, useEffect} from 'react';
import { Link, useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import MuiPhoneNumber from "material-ui-phone-number";
import axios from 'axios';
import { BASE_URL, FOOTER_TEXT, google } from '../utils/constants';

import imgLogo from '../assets/images/logo-256.png';

const styles = (theme) => ({
    container:{
        width:'100vw',
        height:'100vh',
        padding:0,
        boxSizing: 'border-box',
        background: '#fafafa',
        overflowX:'hidden',
        overflowY:'auto'
    },
    header:{
        paddingTop:32,
        paddingBottom:32,
        '& img':{
            width:193,
            height:64
        }
    },
    content:{
        flex:1,
        paddingTop:2,
        paddingBottom:32,
        paddingLeft:20,
        paddingRight:20
    },
    footer:{
        paddingTop: 32,
        paddingBottom:32,
        fontFamily:'Roboto',
        fontSize: 14,
        color: '#89969f',
        fontWeight: 500,
        fontStyle: 'normal',
        textAlign:'center'
    },
    paper:{
        width:'100%',
        maxWidth:684,
        paddingTop: 32,
        paddingLeft: 80,
        paddingRight: 80,
        paddingBottom: 30,
        borderRadius: 8,
        boxSizing: 'border-box',
        border:'1px solid #dee7ee',
        backgroundColor: '#fff', //'#e5e5e5',
        boxShadow: 'unset',
        [theme.breakpoints.down('xs')]: {
           paddingLeft: 20,
           paddingRight: 20  
        }
    },
    title:{
        marginBottom: 32,
        fontFamily: 'Roboto',
        fontSize: 24,
        fontWeight: 500,
        color: '#767786',
        fontStyle: 'normal'
    },
    error:{
       marginBottom:20,
       fontFamily: 'Roboto',
       color:'red'
    },
    textBox:{
        marginBottom: 24,
        '& .MuiInputBase-root':{
           width: 'auto',
           height: 56,
           borderRadius: 6,
           backgroundColor: '#fff',
        },
        '& .MuiOutlinedInput-input':{
           padding: '19px 16px',
           fontFamily: 'Roboto',
           fontSize: 16,
           color: '#171d29',
           fontWeight: 400,
           fontStyle: 'normal'
        },
        '& .MuiOutlinedInput-notchedOutline':{
            borderColor:'#767786'
        },
        '& .MuiInputAdornment-positionEnd':{
            marginRight:10
        }
    },
    signupButton:{
        marginBottom: 16,
        width: '100%',
        height: 56,
        borderRadius: 16,
        '& span':{
            fontFamily: 'Roboto',
            fontSize: 18,
            fontWeight: 500,
            textAlign: 'center',
            color: '#fff',
            fontStyle: 'normal'
        }
    },
    signinLabel:{
        fontFamily:'Roboto',
        fontSize: 14,
        color: '#767786',
        fontWeight: 400,
        fontStyle: 'normal'
    }
});

function Signup(props) {
  const { classes } = props;
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const handlePhoneChange = (value) => {
    if(value){
        setPhone(value);
    }
  };

  const handleSubmit = (e)=>{
    
    //e.preventDefault();
    setSubmitClicked(true);
    setSubmitError(null);

    var params = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address
    }

    axios.post(`${BASE_URL}/api/user/register`, params).then(function(response){
        if(response.data.status === 'success'){
            history.push('/Email-Verify');
        }else{
            //console.log(response.data.message);
            setSubmitError(response.data.message);
        }
        setSubmitClicked(false);
    }).catch(function(error){
        console.log(error);
        setSubmitClicked(false);
    });
  };

  useEffect(() => {
    var input = document.getElementById("user-address");
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        setAddress(place.formatted_address);
    });
  },[]);

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
        if (value !== password) {
            return false;
        }
        return true;
    });
  },[confirmPassword]);

  return (
    <Grid className={classes.container} container direction="column" justifyContent="space-between" alignItems="center" wrap="nowrap">
        <div className={classes.header}>
            <img src={imgLogo} alt="Roof-Logo"/>
        </div>
        <Grid className={classes.content} container direction="column" alignItems="center" wrap="nowrap">
            <Paper className={classes.paper}>
                <Grid container justifyContent="center" alignItems="center" className={classes.title}>
                    Sign up to Xcope
                </Grid>
                {submitError?<div className={classes.error}>{submitError}</div>:null}
                <ValidatorForm onSubmit={handleSubmit}>
                    <TextValidator className={classes.textBox}
                        name="name" label="Full Name"
                        InputLabelProps={{shrink: true}} 
                        placeholder="Enter full name"
                        value={name} onChange={(e)=>setName(e.target.value)}
                        validators={['required']} errorMessages={['Name is required']}
                        variant="outlined" fullWidth autoComplete="off"
                    />
                    <TextValidator className={classes.textBox}
                        name="email" label="Email"
                        InputLabelProps={{shrink: true}}
                        placeholder="youremail@example.com"
                        value={email} onChange={(e)=>setEmail(e.target.value)}
                        validators={['required', 'isEmail']} errorMessages={['Email is required', 'Email is not valid']}
                        variant="outlined" fullWidth autoComplete="off"
                    />
                    <MuiPhoneNumber className={classes.textBox} name="phone"
                        InputLabelProps={{shrink: true}}
                        defaultCountry={'us'} label="Phone Number"  data-cy="user-phone"
                        value={phone}  onChange={handlePhoneChange}
                        variant="outlined" fullWidth autoComplete="off"
                    />
                    <TextValidator className={classes.textBox} id="user-address" name="address" label="Address"
                        InputLabelProps={{shrink: true}}
                        placeholder="Enter your address"
                        value={address} onChange={(e)=>setAddress(e.target.value)}
                        validators={['required']} errorMessages={['Address is required']}
                        variant="outlined" fullWidth autoComplete="off"
                    />
                    <TextValidator type={showPassword ? 'text' : 'password'} className={classes.textBox}
                        name="password" label="Password"
                        InputLabelProps={{shrink: true}}
                        value={password} onChange={(e)=>setPassword(e.target.value)}
                        InputProps={{
                            endAdornment:(
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility"
                                        onClick={()=>setShowPassword(!showPassword)}
                                        onMouseDown={(e)=>e.preventDefault()}
                                        edge="end"
                                    >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                              </InputAdornment>
                            )
                        }}
                        validators={['required','minStringLength:6']} errorMessages={['Password is required','At least 6 characters']}
                        variant="outlined" fullWidth autoComplete="off"/>
                    
                    <TextValidator type={showConfirmPassword ? 'text' : 'password'} className={classes.textBox}
                        name="confirmPassword" label="Confirm Password"
                        InputLabelProps={{shrink: true}}
                        value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
                        InputProps={{
                            endAdornment:(
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility"
                                        onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                                        onMouseDown={(e)=>e.preventDefault()}
                                        edge="end"
                                    >
                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                              </InputAdornment>
                            )
                        }}
                        validators={['isPasswordMatch', 'required']}
                        errorMessages={['password mismatch', 'this field is required']}
                        variant="outlined" fullWidth autoComplete="off"
                    />
                    <Button type="submit" variant="contained" color="primary" className={classes.signupButton} disabled={submitClicked}>
                        {submitClicked?<CircularProgress size={24} />:'Sign Up'}
                    </Button>
                </ValidatorForm>
                <Grid className={classes.signinLabel} container direction="row" justifyContent="center" alignItems="center">
                    <span style={{marginRight:10}}>Do you already have an account?</span>
                    <Link to={`/Login`}  style={{textDecoration:'none',color:'#5c77ff'}}>
                        Sign In Now
                    </Link>
                </Grid>
            </Paper>
        </Grid>
        <div className={classes.footer}>{FOOTER_TEXT}</div>
    </Grid>
  );
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signup);