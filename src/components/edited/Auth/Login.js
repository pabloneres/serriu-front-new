import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "~/_metronic/_helpers";
import { useDispatch } from 'react-redux'
import { Auth, Profile } from '~/store/modules/auth/Auth.actions'


import { store, auth, profile } from '~/controllers/controller'
/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  username: "",
  password: ""
};

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
      // .required(
      //   intl.formatMessage({
      //     id: "AUTH.VALIDATION.REQUIRED_FIELD",
      //   })
      // ),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setTimeout(() => {
        auth({username: values.username, password: values.password})
          .then(({ data: { token } }) => {
            // disableLoading();
            // props.login(accessToken);
            // console.log('ok')
            dispatch(Auth(token))
            
            profile(token).then(({data}) => {
              console.log(data)
              dispatch(Profile(data))
            })
            

          })
          .catch(() => {
            disableLoading();
            setSubmitting(false);
            setStatus(
              intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_LOGIN",
              })
            );
          });
      }, 1000);
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form"
      style={{minWidth: 500}}
    >
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <img
          alt="Logo"
          className="max-h-70px"
          src={toAbsoluteUrl("/media/logos/serriu_logo.svg")}
        />
      </div>

      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : (
          // <div className="mb-10 alert alert-custom alert-light-info alert-dismissible">
          //   <div className="alert-text ">
          //     <p>Use a conta  <strong>master@hotmail.com</strong> para acesso no admin</p>
          //     <p>Use a conta  <strong>matriz@hotmail.com</strong> para acesso na matriz</p>
          //     <p>Use a conta  <strong>clinica@hotmail.com</strong> para acesso na filial</p>
          //     <p>Todas as contas usam a mesma senha <strong>master123</strong></p>
          //   </div>
          // </div>
          <></>
        )}

        <div className="form-group fv-plugins-icon-container">
          <input
            autoComplete={false}
            placeholder="Usúario"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "username"
            )}`}
            name="username"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.username}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container">
          <input
            autoComplete={false}
            placeholder="Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "password"
            )}`}
            name="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          <Link
            to="/auth/forgot-password"
            className="text-dark-50 text-hover-primary my-3 mr-2"
            id="kt_login_forgot"
          >
            Esqueceu a Senha ?
          </Link>
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>Entrar</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
