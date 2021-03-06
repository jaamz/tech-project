import { LOGIN_REQUEST, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT } from '../Constants';
import jwtDecode from 'jwt-decode';


const initialState = (token => ({
    currentUser: token ? jwtDecode(token).id : null,
    isAuthenticating: false, 
    errorMessage: null,
    isAuthorized: false
}))(localStorage.authToken)

const loginReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOGIN_REQUEST:
        return {
          ...state,
          isAuthenticating: true
        }
      case LOGIN_FAILURE:
        return {
          ...state,
          isAuthenticating: false,
          isAuthorized: false,
          errorMessage: action.errorMessage
        }
      case LOGIN_SUCCESS:
        return {
          ...state,
          isAuthenticating: false,
          currentUser: action.user,
          errorMessage: null,
          isAuthorized: true
        }
      case LOGOUT:
        return {
          ...state,
          isAuthenticating: false,
          currentUser: null,
          errorMessage: null,
          isAuthorized: false
        } 
        default:
            return state;
  }
}
export default loginReducer;