import React, {useState} from 'react';
import { Link, useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';
import {BASE_URL, FOOTER_TEXT} from '../utils/constants';

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
      paddingTop:32,
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
        [theme.breakpoints.down('sm')]: {
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
           backgroundColor: '#fff'
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
    },
    submitButton:{
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

function ForgotPassword(props) {
  const { classes} = props;
  const [email, setEmail] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const history = useHistory();

  const handleEmailChange = (event)=>{
     setEmail(event.target.value);
  };

  const handleSubmit = ()=>{
      
      setSubmitClicked(true);
      setSubmitError(null);
      var params = {
          email: email
      }
      axios.post(`${BASE_URL}/api/user/forgot-password`, params).then(function(response){
         if(response.data.status === 'success'){
             history.push('/Login');
         }else{
             //console.log(response.data.message);
             setSubmitError(response.data.message);
         }
         setSubmitClicked(false);
     }).catch(function(error){
         //console.log(error);
         setSubmitClicked(false);
     });
  };

  return (
      <Grid className={classes.container} container direction="column" justifyContent="space-between" alignItems="center" wrap="nowrap">
            <div className={classes.header}>
                <img src={imgLogo} alt="Roof-Logo"/>
            </div>
            <Grid className={classes.content} container direction="column" alignItems="center" wrap="nowrap">
                <Paper className={classes.paper}>
                    <Grid container justifyContent="center" alignItems="center" className={classes.title}>
                        Forgot Password
                    </Grid>
                    {submitError?<div className={classes.error}>{submitError}</div>:null}
                    <ValidatorForm onSubmit={handleSubmit}>
                        <TextValidator className={classes.textBox} name="email" label="Email Address"
                            InputLabelProps={{shrink: true}} placeholder="Enter your email address"
                            value={email} onChange={handleEmailChange}
                            validators={['required', 'isEmail']} errorMessages={['Email is required', 'Email is not valid']}
                            variant="outlined" fullWidth autoComplete="off"
                        />
                        <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={submitClicked}>
                            {submitClicked?<CircularProgress size={24} />:'Submit'}
                        </Button>
                    </ValidatorForm>
                    <Grid className={classes.signinLabel} container direction="row" justifyContent="center" alignItems="center">
                        <span style={{marginRight:10}}>Do you remember your password?</span>
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
  
ForgotPassword.propTypes = {
   classes: PropTypes.object.isRequired
};
  
export default withStyles(styles)(ForgotPassword);

