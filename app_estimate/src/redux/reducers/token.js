
import {SET_TOKEN, REMOVE_TOKEN} from "../actionTypes";

export default function token(state = null, action) {
    const {newValue} = action.payload ? action.payload : {};
    switch (action.type){
      case SET_TOKEN: 
          localStorage.setItem('token', JSON.stringify({token:newValue}));
          return newValue;
      case REMOVE_TOKEN: 
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return null;     
      default:
          const tokenString = localStorage.getItem('token');
          const userToken = JSON.parse(tokenString);
          return userToken?userToken.token:null;
    }
}