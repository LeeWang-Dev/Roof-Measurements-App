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
import imgLogo from '../assets/images/logo-256.png';
import { BASE_URL, FOOTER_TEXT } from '../utils/constants';

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

function EmailVerify(props) {
  const { classes } = props;
  const [verifyCode, setVerifyCode] = useState('');
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [submitError, setSubmitError] = useState('We sent message to your email. Please check your email.');

  const history = useHistory();

  const handleVerifyCodeChange = (event)=>{
     setVerifyCode(event.target.value);
  };

  const handleSubmit = (e)=>{
     //e.preventDefault();
     setConfirmClicked(true);
     setSubmitError(null);

     axios.put(`${BASE_URL}/api/user/email-verification/${verifyCode}`).then(function(response){
        if(response.data.status === 'success'){
            history.push('/Login');
        }else{
            //console.log(response.data.message);
            setSubmitError(response.data.message);
        }
        setConfirmClicked(false);
    }).catch(function(error){
        //console.log(error);
        setConfirmClicked(false);
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
                    Your Email Verification
                </Grid>
                {submitError?<div className={classes.error}>{submitError}</div>:null}
                <ValidatorForm onSubmit={handleSubmit}>
                    <TextValidator className={classes.textBox}
                        name="verifyDode" label="Verify Code"
                        InputLabelProps={{shrink: true}} placeholder="Enter your verify code"
                        value={verifyCode} onChange={handleVerifyCodeChange}
                        validators={['required']} errorMessages={['Verify code is required']}
                        variant="outlined" fullWidth autoComplete="off"
                    />
                    <Grid container justifyContent="center">
                        <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={confirmClicked}>
                            {confirmClicked?<CircularProgress size={24} />:'Confirm'}
                        </Button>
                    </Grid>
                </ValidatorForm>
                <Grid className={classes.signinLabel} container direction="row" justifyContent="center" alignItems="center">
                    <span style={{marginRight:10}}>Didn't you receive verify code?</span>
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
  
EmailVerify.propTypes = {
   classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(EmailVerify);

