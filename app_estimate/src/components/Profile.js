import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";

// import material ui dialog
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { Container } from "@material-ui/core";

import { Add } from "@material-ui/icons";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import MuiPhoneNumber from "material-ui-phone-number";

import axios from "axios";
import { BASE_URL, google } from "../utils/constants";
import { removeToken } from "../redux/actions/token";

import imgLogo from "../assets/images/Logotipe.png";

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
    height: 56,
    padding: "8px 24px",
    color: "#fff",
    fontStyle: "normal",
    backgroundColor: "#5c77ff",
  },
  accountBox: {
    display: "flex",
    alignItems: "center",
    alignSelf: "center",
    fontSize: 12,
    color: "#fff",
    fontStyle: "normal",
    cursor: "pointer",
  },
  content: {
    paddingTop: 48,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  paper: {
    width: "100%",
    maxWidth: 684,
    padding: 0,
    borderRadius: 8,
    boxSizing: "border-box",
    border: "1px solid #dee7ee",
    backgroundColor: "#fff", //'#e5e5e5',
    boxShadow: "unset",
  },
  profileHeader: {
    paddingTop: 32,
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
    fontSize: 24,
    fontWeight: 500,
    color: "#171d29",
    fontStyle: "normal",
    borderBottom: "1px solid #dee7ee",
  },
  error: {
    marginBottom: 20,
    fontFamily: "Roboto",
    color: "red",
  },
  profileContent: {
    paddingTop: 35,
    paddingLeft: 80,
    paddingRight: 80,
    paddingBottom: 56,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  sectionTitle: {
    padding: "8px 0",
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 500,
    fontStyle: "normal",
    color: "#767786",
    textTransform: "uppercase",
  },
  textBox: {
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
  submitButton: {
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
  cancelButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    border: "1px solid #767786",
    "& span": {
      fontFamily: "Roboto",
      fontSize: 18,
      fontWeight: 500,
      textAlign: "center",
      color: "#767786",
      fontStyle: "normal",
    },
  },
  dialog: {
    "& .MuiBackdrop-root": {
      backgroundColor: "#171d29e6",
    },
    "& .MuiDialog-paperWidthSm": {
      maxWidth: 684,
    },
    "& .MuiDialog-paper": {
      width: 684,
    },
    "& .MuiDialogTitle-root": {
      padding: 32,
      borderBottom: "1px solid #76778633",
      fontSize: 24,
      fontWeight: 500,
      fontStyle: "normal",
      color: "#171d29",
    },
    "& .MuiDialogContent-root": {
      padding: "24px 80px",
    },
    [theme.breakpoints.down("xs")]: {
      "& .MuiDialog-paperWidthSm": {
        width: "100%",
      },
      "& .MuiDialogContent-root": {
        padding: 20,
      },
    },
  },
  forgotLabel: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#5c77ff",
    fontWeight: 400,
    fontStyle: "normal",
    cursor: "pointer",
  },
  uploadPicture: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 140,
    borderRadius: 8,
    border: "2px dashed #767786",
    fontSize: 12,
    fontWeight: 500,
    color: "#5c77ff",
    fontStyle: "normal",
    cursor: "pointer",
    "& .MuiSvgIcon-root": {
      marginBottom: 4,
    },
  },
});

function Profile(props) {
  const { classes, token, removeToken } = props;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const [anchorAccountElement, setAnchorAccountElement] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [submitProfileClicked, setSubmitProfileClicked] = useState(false);
  const [submitProfileError, setSubmitProfileError] = useState(null);

  const [changePasswordSubmitClicked, setChangePasswordSubmitClicked] =
    useState(false);
  const [changePasswordSubmitError, setChangePasswordSubmitError] =
    useState(null);

  const [deleteAccountSubmitClicked, setDeleteAccountSubmitClicked] =
    useState(false);
  const [deleteAccountSubmitError, setDeleteAccountSubmitError] =
    useState(null);

  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [deleteAccountConfirmDialogOpen, setDeleteAccountConfirmDialogOpen] =
    useState(false);
  const [photo, setPhoto] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handlePhoneChange = (value) => {
    if (value) {
      setPhone(value);
    }
  };

  const handleSubmitProfile = () => {
    setSubmitProfileClicked(true);
    setSubmitProfileError(null);
    var params = {
      name: name,
      email: email,
      phone: phone,
      address: address,
    };
    axios
      .put(`${BASE_URL}/api/user/change/profile`, params)
      .then(function (response) {
        if (response.data.status === "success") {
          removeToken();
        } else {
          //console.log(response.data.message);
          setSubmitProfileError(response.data.message);
          if (response.data.status === "failed-token") {
            removeToken();
          }
        }
        setSubmitProfileClicked(false);
      })
      .catch(function (error) {
        console.log(error);
        setSubmitProfileClicked(false);
      });
  };

  const handleChangePasswordSubmit = () => {
    setChangePasswordSubmitClicked(true);
    setChangePasswordSubmitError(null);
    var params = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    axios
      .put(`${BASE_URL}/api/user/change/password`, params)
      .then(function (response) {
        if (response.data.status === "success") {
          removeToken();
        } else {
          //console.log(response.data.message);
          setChangePasswordSubmitError(response.data.message);
          if (response.data.status === "failed-token") {
            removeToken();
          }
        }
        setChangePasswordSubmitClicked(false);
      })
      .catch(function (error) {
        console.log(error);
        setChangePasswordSubmitClicked(false);
      });

    return () => {};
  };

  const handleDeleteAccountSubmit = () => {
    setDeleteAccountConfirmDialogOpen(true);
  };

  const handleDeleteAccountConfirmDialogOk = () => {
    setDeleteAccountConfirmDialogOpen(false);
    setDeleteAccountSubmitClicked(true);
    setDeleteAccountSubmitError(null);
    const config = {
      headers: { "Content-Type": "application/json" },
      data: {
        currentPassword: currentPassword,
      },
    };
    axios
      .delete(`${BASE_URL}/api/user/delete`, config)
      .then(function (response) {
        if (response.data.status === "success") {
          removeToken();
        } else {
          //console.log(response.data.message);
          setDeleteAccountSubmitError(response.data.message);
          if (response.data.status === "failed-token") {
            removeToken();
          }
        }
        setDeleteAccountSubmitClicked(false);
      })
      .catch(function (error) {
        console.log(error);
        setDeleteAccountSubmitClicked(false);
      });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  useEffect(() => {
    var input = document.getElementById("user-address");
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, "place_changed", function () {
      var place = autocomplete.getPlace();
      setAddress(place.formatted_address);
    });

    axios
      .get(`${BASE_URL}/api/user/get/profile`)
      .then(function (response) {
        if (response.data.status === "success") {
          var user = response.data.results[0];
          setName(user.name);
          setEmail(user.email);
          setPhone(user.phone);
          setAddress(user.address);
          setPhoto(user.profile_photo);
        } else {
          console.log(response.data.message);
          if (response.data.status === "failed-token") {
            removeToken();
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    return () => {};
  }, []);

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== newPassword) {
        return false;
      }
      return true;
    });
  }, [confirmPassword]);

  return (
    <Grid
      className={classes.container}
      container
      direction="column"
      wrap="nowrap"
    >
      <Grid
        className={classes.header}
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        wrap="nowrap"
      >
        <Link
          to="/Projects"
          style={{ display: "flex", textDecoration: "none" }}
        >
          <img src={imgLogo} alt="Logo" className={classes.logo} />
        </Link>
        <div style={{ flex: 1 }}></div>
        <div
          className={classes.accountBox}
          onClick={(e) => setAnchorAccountElement(e.currentTarget)}
        >
          <Hidden xsDown>
            <div style={{ marginRight: 10 }}>{name}</div>
          </Hidden>
          <AccountCircleIcon fontSize="large" />
          <ExpandMoreIcon fontSize="small" />
        </div>
      </Grid>
      <Grid container justifyContent="center" className={classes.content}>
        <Paper className={classes.paper}>
          <div className={classes.profileHeader}>My user profile</div>
          <div className={classes.profileContent}>
            {submitProfileError ? (
              <div className={classes.error}>{submitProfileError}</div>
            ) : null}

            {/*
                          <Avatar
              alt={name}
              src={imageUrl}
              style={{ height: "200px", width: "200px" }}
            />

            <Grid item xs={6} sm={3}>
              <input
                type="file"
                id={`uploadPicture-profile`}
                accept=".png, .jpg, .jpeg"
                multiple
                style={{ display: "none" }}
                onChange={onImageChange}
              />
              <label
                htmlFor={`uploadPicture-profile`}
                className={classes.uploadPicture}
              >
                <Add />
                <div>ADD PICTURE</div>
              </label>
            </Grid>
              */}

            <Grid
              container
              dirction="row"
              justifyContent="space-between"
              style={{ marginBottom: 24 }}
            >
              <div className={classes.sectionTitle} style={{ opacity: 0.6 }}>
                BASIC INFORMATION
              </div>
              <div
                className={classes.sectionTitle}
                style={{ color: "#5c77ff" }}
              >
                EDIT INFORMATION
              </div>
            </Grid>
            <ValidatorForm
              onSubmit={handleSubmitProfile}
              style={{ width: "100%" }}
            >
              <Grid container spacing={3} style={{ marginBottom: 16 }}>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    className={classes.textBox}
                    name="name"
                    label="Full Name"
                    InputLabelProps={{ shrink: true }}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    validators={["required"]}
                    errorMessages={["Name is required"]}
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    className={classes.textBox}
                    name="email"
                    label="Email"
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
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{ marginBottom: 16 }}>
                <Grid item xs={12} sm={6}>
                  <MuiPhoneNumber
                    className={classes.textBox}
                    name="phone"
                    label="Phone Number"
                    InputLabelProps={{ shrink: true }}
                    defaultCountry={"us"}
                    data-cy="user-phone"
                    defaultCountry={"us"}
                    value={phone}
                    onChange={handlePhoneChange}
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    className={classes.textBox}
                    id="user-address"
                    name="address"
                    label="Address"
                    InputLabelProps={{ shrink: true }}
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    validators={["required"]}
                    errorMessages={["Address is required"]}
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{ marginBottom: 16 }}>
                <Grid item xs={12} sm={6}>
                  <Link to="/Projects" style={{ textDecoration: "none" }}>
                    <Button
                      variant="outlined"
                      color="default"
                      className={classes.cancelButton}
                    >
                      Cancel
                    </Button>
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submitButton}
                    disabled={submitProfileClicked}
                  >
                    {submitProfileClicked ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </ValidatorForm>
            <Divider style={{ backgroundColor: "#dee7ee", margin: "16px 0" }} />
            <div className={classes.sectionTitle} style={{ opacity: 0.6 }}>
              PASSWORD
            </div>
            <Grid container>
              <div
                className={classes.sectionTitle}
                style={{ color: "#5c77ff", cursor: "pointer" }}
                onClick={() => setChangePasswordDialogOpen(true)}
              >
                CHANGE PASSWORD
              </div>
            </Grid>
            <Divider style={{ backgroundColor: "#dee7ee", margin: "16px 0" }} />
            <div className={classes.sectionTitle} style={{ opacity: 0.6 }}>
              ACCOUNT
            </div>
            <Grid container>
              <div
                className={classes.sectionTitle}
                style={{ color: "#F53E3E", cursor: "pointer" }}
                onClick={() => setDeleteAccountDialogOpen(true)}
              >
                DELETE ACCOUNT
              </div>
            </Grid>
          </div>
        </Paper>
      </Grid>
      <Menu
        id="account-menu"
        anchorEl={anchorAccountElement}
        keepMounted
        open={Boolean(anchorAccountElement)}
        onClose={() => setAnchorAccountElement(null)}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Link to="/Profile" style={{ textDecoration: "none" }}>
          <MenuItem>My Profile</MenuItem>
        </Link>
        <Divider />
        <MenuItem onClick={() => removeToken()}>Logout</MenuItem>
      </Menu>
      <Dialog
        className={classes.dialog}
        open={changePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle disableTypography={true}>Change Password</DialogTitle>
        <DialogContent>
          {changePasswordSubmitError ? (
            <div className={classes.error}>{changePasswordSubmitError}</div>
          ) : null}
          <ValidatorForm
            onSubmit={handleChangePasswordSubmit}
            style={{ width: "100%", marginTop: 16 }}
          >
            <TextValidator
              type={showOldPassword ? "text" : "password"}
              className={classes.textBox}
              style={{ marginBottom: 24 }}
              name="oldPassword"
              label="Old Password"
              InputLabelProps={{ shrink: true }}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showOldPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              validators={["required"]}
              errorMessages={["Old password is required"]}
              variant="outlined"
              fullWidth
              autoComplete="off"
            />
            <TextValidator
              type={showNewPassword ? "text" : "password"}
              className={classes.textBox}
              style={{ marginBottom: 24 }}
              name="newPassword"
              label="New Password"
              InputLabelProps={{ shrink: true }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              validators={["required", "minStringLength:6"]}
              errorMessages={["Password is required", "At least 6 characters"]}
              variant="outlined"
              fullWidth
              autoComplete="off"
            />
            <TextValidator
              type={showConfirmPassword ? "text" : "password"}
              className={classes.textBox}
              style={{ marginBottom: 16 }}
              name="confirmPassword"
              label="Confirm Password"
              InputLabelProps={{ shrink: true }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              validators={["isPasswordMatch", "required"]}
              errorMessages={["password mismatch", "this field is required"]}
              variant="outlined"
              fullWidth
              autoComplete="off"
            />
            <Grid container justifyContent="flex-end" style={{ marginBottom: 24 }}>
              <div
                className={classes.forgotLabel}
                onClick={() => removeToken()}
              >
                Forgot password ?
              </div>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="default"
                  className={classes.cancelButton}
                  onClick={() => setChangePasswordDialogOpen(false)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submitButton}
                  disabled={changePasswordSubmitClicked}
                >
                  {changePasswordSubmitClicked ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </Grid>
            </Grid>
          </ValidatorForm>
        </DialogContent>
      </Dialog>
      <Dialog
        className={classes.dialog}
        open={deleteAccountDialogOpen}
        onClose={() => setDeleteAccountDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle disableTypography={true}>Delete Account</DialogTitle>
        <DialogContent>
          <Grid
            container
            justifyContent="center"
            style={{
              marginBottom: 40,
              fontSize: 16,
              color: "#171d29",
              fontStyle: "normal",
              fontWeight: 400,
            }}
          >
            For security purposes, please re-enter your password below.
          </Grid>
          {deleteAccountSubmitError ? (
            <div className={classes.error}>{deleteAccountSubmitError}</div>
          ) : null}
          <ValidatorForm
            onSubmit={handleDeleteAccountSubmit}
            style={{ width: "100%" }}
          >
            <TextValidator
              type={showCurrentPassword ? "text" : "password"}
              className={classes.textBox}
              style={{ marginBottom: 32 }}
              name="currentPassword"
              label="Current Password"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              validators={["required"]}
              errorMessages={["Password is required"]}
              variant="outlined"
              fullWidth
              autoComplete="off"
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="default"
                  className={classes.cancelButton}
                  onClick={() => setDeleteAccountDialogOpen(false)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  className={classes.submitButton}
                  style={{ backgroundColor: "#f53e3e" }}
                  disabled={deleteAccountSubmitClicked}
                >
                  {deleteAccountSubmitClicked ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Delete Account"
                  )}
                </Button>
              </Grid>
            </Grid>
          </ValidatorForm>
        </DialogContent>
      </Dialog>
      <Dialog
        className={classes.dialog}
        open={deleteAccountConfirmDialogOpen}
        onClose={() => setDeleteAccountConfirmDialogOpen(false)}
      >
        <DialogTitle disableTypography={true}>Delete Account</DialogTitle>
        <DialogContent>
          <Grid
            container
            justifyContent="center"
            style={{
              marginBottom: 40,
              fontSize: 16,
              color: "#171d29",
              fontStyle: "normal",
              fontWeight: 700,
            }}
          >
            Are you sure you want to delete your account ?
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="default"
                className={classes.cancelButton}
                onClick={() => setDeleteAccountConfirmDialogOpen(false)}
              >
                No
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                variant="contained"
                className={classes.submitButton}
                style={{ backgroundColor: "#f53e3e" }}
                onClick={handleDeleteAccountConfirmDialogOk}
              >
                Yes
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

const mapStateToProps = (state) => {
  const { token } = state;
  return { token };
};

const mapDispatchToProps = { removeToken };

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Profile);
