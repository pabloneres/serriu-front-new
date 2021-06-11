import React, {Component, useEffect} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import {LayoutSplashScreen} from "~/_metronic/layout";
import { Auth, Profile, LogoutUser } from '~/store/modules/auth/Auth.actions'

const reset = []
const auth = []

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
    console.log(this.props)
  }

  render() {
    const { token } = this.props;
    return token ? <LayoutSplashScreen /> : <Redirect to="/auth/login" />;
  }
}

export default connect(({ auth }) => ({ hasAuthToken: Boolean(auth.token) }), auth.actions)(Logout);


// export default function Logout() {
//   const {token} = useSelector(state => state.auth)
//   const dispatch = useDispatch()

//   useEffect(() => {
//     (async () => {
//       await dispatch(LogoutUser)
//     })()
//   }, [])

//   return token ? <LayoutSplashScreen /> : <Redirect to="/auth/login" />;

// }