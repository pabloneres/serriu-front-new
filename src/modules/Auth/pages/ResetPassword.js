import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import * as Yup from "yup";
import { injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { reset } from "../_redux/authCrud";

const initialValues = {
  email: "",
};

function Reset(props) {
  const { intl } = props;
  const [isRequested, setIsRequested] = useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    token: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(100, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
      password_confirmation: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

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
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      reset(values.token, values.password, values.password_confirmation)
        .then(() => setIsRequested(true))
        .catch(() => {
          setIsRequested(false);
          setSubmitting(false);
          setStatus(
            intl.formatMessage(
              { id: "AUTH.VALIDATION.NOT_FOUND" },
              { name: values.token }
            )
          );
        });
    },
  });

  return (
    <>
      {isRequested && <Redirect to="/auth" />}
      {!isRequested && (
        <div className="login-form login-forgot" style={{ display: "block" }}>
          <div className="text-center mb-10 mb-lg-20">
            <h3 className="font-size-h1">Forgotten Password ?</h3>
            <div className="text-muted font-weight-bold">
              Enter your email to reset your password
            </div>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
          >
            {formik.status && (
              <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                <div className="alert-text font-weight-bold">
                  {formik.status}
                </div>
              </div>
            )}


            <div className="form-group fv-plugins-icon-container">
              <input
                type="text"
                placeholder="Token"
                type="text"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "token"
                )}`}
                name="token"
                {...formik.getFieldProps("token")}
              />
              {formik.touched.token && formik.errors.token ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.token}</div>
                </div>
              ) : null}

            </div>
            <div className="form-group fv-plugins-icon-container">
              <input
                type="password"
                placeholder="Password"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "fullname"
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
            <div className="form-group fv-plugins-icon-container">

              <input
                placeholder="Password"
                type="password"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "password"
                )}`}
                name="password_confirmation"
                {...formik.getFieldProps("password_confirmation")}
              />
              {formik.touched.password_confirmation && formik.errors.password_confirmation ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.password_confirmation}</div>
                </div>
              ) : null}
            </div>
            <div className="form-group d-flex flex-wrap flex-center">
              <button
                id="kt_login_forgot_submit"
                type="submit"
                className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                disabled={formik.isSubmitting}
              >
                Submit
              </button>
              <Link to="/auth">
                <button
                  type="button"
                  id="kt_login_forgot_cancel"
                  className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(Reset));
