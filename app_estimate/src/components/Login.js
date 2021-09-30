import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import axios from "axios";
import { BASE_URL, FOOTER_TEXT } from "../utils/constants";
import imgLogo from "../assets/images/logo-256.png";
import { setToken } from "../redux/actions/token";

const styles = (theme) => ({
  container: {
    width: "100vw",
    height: "100vh",
    padding: 0,
    boxSizing: "border-box",
    background: "#fafafa",
    overflowX: "hidden",
    overflowY: "auto",
  },
  header: {
    paddingTop: 32,
    paddingBottom: 32,
    "& img": {
      width: 193,
      height: 64,
    },
  },
  content: {
    flex: 1,
    paddingTop: 32,
    paddingBottom: 32,
    paddingLeft: 20,
    paddingRight: 20,
  },
  footer: {
    paddingTop: 32,
    paddingBottom: 32,
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#89969f",
    fontWeight: 500,
    fontStyle: "normal",
    textAlign: "center",
  },
  paper: {
    width: "100%",
    maxWidth: 684,
    paddingTop: 32,
    paddingLeft: 80,
    paddingRight: 80,
    paddingBottom: 30,
    borderRadius: 8,
    boxSizing: "border-box",
    border: "1px solid #dee7ee",
    backgroundColor: "#fff", //'#e5e5e5',
    boxShadow: "unset",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 20,
      paddingRight: 20,
    },
  },
  title: {
    marginBottom: 32,
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: 500,
    color: "#767786",
    fontStyle: "normal",
  },
  error: {
    marginBottom: 20,
    fontFamily: "Roboto",
    color: "red",
  },
  textBox: {
    marginBottom: 24,
    "& .MuiInputBase-root": {
      width: "auto",
      height: 56,
      borderRadius: 6,
      backgroundColor: "#fff",
    },
    "& .MuiOutlinedInput-input": {
      padding: "19px 16px",
      fontFamily: "Roboto",
      fontSize: 16,
      color: "#171d29",
      fontWeight: 400,
      fontStyle: "normal",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#767786",
    },
    "& .MuiInputAdornment-positionEnd": {
      marginRight: 10,
    },
  },
  loginButton: {
    marginBottom: 16,
    width: "100%",
    height: 56,
    borderRadius: 16,
    "& span": {
      fontFamily: "Roboto",
      fontSize: 18,
      fontWeight: 500,
      textAlign: "center",
      color: "#fff",
      fontStyle: "normal",
    },
  },
  forgotLabel: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#5c77ff",
    fontWeight: 400,
    fontStyle: "normal",
  },
  signupLabel: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#767786",
    fontWeight: 400,
    fontStyle: "normal",
  },
});

function Login(props) {
  const { classes, setToken } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberChecked, setRememberChecked] = useState(false);
  const [loginClicked, setLoginClicked] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const history = useHistory();

  const handleSubmit = (e) => {
    //e.preventDefault();
    setLoginClicked(true);
    setSubmitError(null);

    var params = {
      email: email,
      password: password,
      remember: rememberChecked,
    };

    axios
      .post(`${BASE_URL}/api/user/login`, params)
      .then(function (response) {
        if (response.data.status === "success") {
          var data = response.data;
          setToken(data.token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              email: data.email,
              name: data.name,
              photo: data.photo,
            })
          );
        } else if (response.data.status === "failed-email-verification") {
          history.push("/Email-Verify");
        } else {
          //console.log(response.data.message);
          setSubmitError(response.data.message);
        }
        setLoginClicked(false);
      })
      .catch(function (error) {
        //console.log(error);
        setLoginClicked(false);
      });
  };

  return (
    <Grid
      className={classes.container}
      container
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      wrap="nowrap"
    >
      <div className={classes.header}>
        <img src={imgLogo} alt="Roof-Logo" />
      </div>
      <Grid
        className={classes.content}
        container
        direction="column"
        alignItems="center"
        wrap="nowrap"
      >
        <Paper className={classes.paper}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={classes.title}
          >
            Sign in to Xcope
          </Grid>
          {submitError ? (
            <div className={classes.error}>{submitError}</div>
          ) : null}
          <ValidatorForm onSubmit={handleSubmit}>
            <TextValidator
              className={classes.textBox}
              name="email"
              label="Email Address"
              InputLabelProps={{ shrink: true }}
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              validators={["required", "isEmail"]}
              errorMessages={["Email is required", "Email is not valid"]}
              variant="outlined"
              fullWidth
              autoComplete="off"
            />
            <TextValidator
              type={showPassword ? "text" : "password"}
              className={classes.textBox}
              style={{ marginBottom: 0 }}
              name="password"
              label="Password"
              InputLabelProps={{ shrink: true }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              validators={["required"]}
              errorMessages={["Password is required"]}
              variant="outlined"
              fullWidth
              autoComplete="off"
            />
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              style={{ marginBottom: 10 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberChecked}
                    onChange={(e) => setRememberChecked(!rememberChecked)}
                    name="remember"
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link
                to={`/Forgot-Password`}
                className={classes.forgotLabel}
                style={{ textDecoration: "none" }}
              >
                Forgot password ?
              </Link>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.loginButton}
              disabled={loginClicked}
            >
              {loginClicked ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </ValidatorForm>
          <Grid
            className={classes.signupLabel}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <span style={{ marginRight: 10 }}>Don't have an account?</span>
            <Link
              to={`/Signup`}
              style={{ textDecoration: "none", color: "#5c77ff" }}
            >
              Sign Up Now
            </Link>
          </Grid>
        </Paper>
      </Grid>
      <div className={classes.footer}>{FOOTER_TEXT}</div>
    </Grid>
  );
}

const mapStateToProps = (state) => {
  const { token } = state;
  return { token };
};

const mapDispatchToProps = { setToken };

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Login);
