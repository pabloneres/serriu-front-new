/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";

export function DropdownMenu4() {
  return (
    <>
      {/*begin::Navigation*/}
      <ul className="navi navi-hover py-5">
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-drop"></i>
            </span>
            <span className="navi-text">Novo Grupo</span>
          </a>
        </li>
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-list-3"></i>
            </span>
            <span className="navi-text">Contatos</span>
          </a>
        </li>
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-rocket-1"></i>
            </span>
            <span className="navi-text">Grupos</span>
            <span className="navi-link-badge">
              <span className="label label-light-primary label-inline font-weight-bold">
                new
              </span>
            </span>
          </a>
        </li>
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-bell-2"></i>
            </span>
            <span className="navi-text">Chamados</span>
          </a>
        </li>
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-gear"></i>
            </span>
            <span className="navi-text">Configurações</span>
          </a>
        </li>

        <li className="navi-separator my-3"></li>

        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-magnifier-tool"></i>
            </span>
            <span className="navi-text">Ajuda</span>
          </a>
        </li>
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-bell-2"></i>
            </span>
            <span className="navi-text">Privacide</span>
            <span className="navi-link-badge">
              <span className="label label-light-danger label-rounded font-weight-bold">
                5
              </span>
            </span>
          </a>
        </li>
      </ul>
      {/*end::Navigation*/}
    </>
  );
}
