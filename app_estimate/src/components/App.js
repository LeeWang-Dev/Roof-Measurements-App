import React from 'react';
import { compose } from "recompose";
import { connect } from "react-redux";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import Login from './Login';
import Signup from './Signup';
import EmailVerify from './EmailVerify';
import ForgotPassword from './ForgotPassword';
import Projects from './Projects';
import Profile from './Profile';
import Edit from './Edit/Edit';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);

let theme = createTheme({
  palette: {
    primary: {
      light: '#7986cb',
      main: '#5c77ff',
      dark: '#303f9f'
    }
  },
  spacing:8,
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        border: 'none',
        backgroundColor: '#ffffff', //'#18202c',
      },
    },
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiMenu:{
      paper:{
        border:'1px solid #b8c5d0',
        minWidth: 140,
        borderRadius:8,
        boxShadow:'none'
      }
    },
    MuiList: {
      padding: {
        paddingTop:0,
        paddingBottom:0
      }
    },
    MuiMenuItem: {
       root: {
         paddingTop:12,
         paddingBottom:12,
         paddingLeft:16,
         paddingRight:16,
         fontSize:14,
         color: '#171d29',
         '&.Mui-selected': {
           color:'#5c77ff',            
           fontWeight: 800,
           backgroundColor: 'unset',
           '& .MuiListItemText-primary': {
              fontWeight: 800,
            }
         },
         '&:hover, &.Mui-selected:hover': {
           color:'#5c77ff',
           backgroundColor: '#d8d8d81f', //rgba(216,216,216,0.12)
         }
       }
    },
    MuiListItemText:{
      root:{
        marginTop: 0,
        marginBottom: 0
      },
      primary: {
         fontFamily: 'Roboto',
         fontSize: 14,
         fontWeight: 'normal',
         fontStyle: 'normal',
         color: '#5c77ff'
      }
    },
    MuiListItemSecondaryAction:{
      root:{
        right: 0
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: '#b8c5d0',
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
    MuiPopover:{
      paper:{
        borderRadius: 4
      }
    }
  },
};

function App(props) {
  const {token} = props;
  
  return (
      <ThemeProvider theme={theme}>
          <BrowserRouter>
            {
              token ?
                <Switch>
                    <Redirect exact from="/" to="/Projects" />
                    <Redirect from="/Login" to="/Projects" />
                    <Route path="/Projects" component={Projects} />
                    <Route path="/Profile" component={Profile} />
                    <Route path="/Edit/Create-Project/:name/:address/:type" component={Edit} />
                    <Route path="/Edit/Project/:id" component={Edit} />
                    <Route path="*"  />
                </Switch>
              :
                <Switch>
                    <Route path="/Login" component={Login} />
                    <Route path="/Signup" component={Signup} />
                    <Route path="/Email-Verify" component={EmailVerify} />
                    <Route path="/Forgot-Password" component={ForgotPassword} />
                    <Redirect to="/Login" />
                </Switch>
            }
          </BrowserRouter>
      </ThemeProvider>
  );
}

const mapStateToProps = state => {
  const { token } = state;
  return { token };
};

export default compose(
  connect(mapStateToProps)
)(App);







