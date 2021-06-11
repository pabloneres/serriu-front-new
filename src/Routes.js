import React, {useEffect} from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { Layout } from "~/_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "~/components/edited/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
import {index} from '~/controllers/controller'
import { Store, Select } from '~/store/modules/clinic/Clinic.actions'
import { StateChangeTypes } from "downshift";

const isAuthorized = null

export function Routes() {
  const { isAuthorized } = useSelector(({ auth }) => ({isAuthorized: auth.user != null,}), shallowEqual
  );

  const { token } = useSelector(state => state.auth)

  const dispatch = useDispatch()

  useEffect(() => {
    if (token) {
      index(token, '/clinic').then(({data}) => {
        dispatch(Store(data))
      })
    }
  }, [])

  return (
    <Switch>
      {!isAuthorized ? (
        /*Render auth page when user at `/auth` and not authorized.*/
        <Route>
          <AuthPage />
        </Route>
      ) : (
        /*Otherwise redirect to root page (`/`)*/
        <Redirect from="/auth" to="/" />
      )}

      <Route path="/error" component={ErrorsPage} />
      <Route path="/logout" component={Logout} />

      {!isAuthorized ? (
        /*Redirect to `/auth` when user is not authorized*/
        <Redirect to="/auth/login" />
      ) : (
        <Layout>
          <BasePage />
        </Layout>
      )}
    </Switch>
  );
}
