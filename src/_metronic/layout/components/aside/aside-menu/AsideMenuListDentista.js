/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function AsideMenuListDentista({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG style={{"fill": "#3699FF", "color": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/agenda", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/agenda">
            <span className="svg-icon menu-icon">
              <SVG style={{"fill": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/calendar.svg")} />
            </span>
            <span className="menu-text">Agenda</span>
          </NavLink>
        </li>
         {/* <li
          className={`menu-item ${getMenuItemActive("/orcamento", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/orcamento">
            <span className="svg-icon menu-icon">
              <SVG style={{"fill": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/money.svg")} />
            </span>
            <span className="menu-text">Orçamento</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/pacientes", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/pacientes">
            <span className="svg-icon menu-icon">
              <SVG style={{"fill": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/pacients.svg")} />
            </span>
            <span className="menu-text">Pacientes</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/financeiro", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/financeiro">
            <span className="svg-icon menu-icon">
              <SVG style={{"fill": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/money.svg")} />
            </span>
            <span className="menu-text">Financeiros</span>
          </NavLink>
        </li> */}
        {/* <li
          className={`menu-item menu-item-submenu ${getMenuItemActive("/usuarios", false)}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/usuarios">
            <span className="svg-icon menu-icon">
              <SVG style={{"fill": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/users.svg")} />
            </span>
            <span className="menu-text">Usúarios</span>
            <i className="menu-arrow" ></i>
          </NavLink>
          <div className="menu-submenu ">
          <i className="menu-arrow"></i>
          <ul className="menu-subnav">
          <li className="menu-item  menu-item-parent" aria-haspopup="true">
            <span className="menu-link">
              <span className="menu-text">Usúarios</span>
            </span>
          </li>
            <li className="menu-item menu-item-submenu " aria-haspopup="true" data-menu-toggle="hover">
              <NavLink className="menu-link menu-toggle" to="/dentista">
                <span className="menu-text">Dentistas</span>
              </NavLink>
            </li>
            <li className="menu-item menu-item-submenu " aria-haspopup="true" data-menu-toggle="hover">
              <NavLink className="menu-link menu-toggle" to="/recepcionista">
                <span className="menu-text">Recepcionistas</span>
              </NavLink>
            </li>
          </ul>
          </div>
        </li> */}
        {/* <li
          className={`menu-item menu-item-submenu ${getMenuItemActive("/configuracoes", false)}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/configuracoes">
            <span className="svg-icon menu-icon">
              <SVG style={{"fill": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/settings.svg")} />
            </span>
            <span className="menu-text">Configurações</span>
            <i className="menu-arrow" ></i>
          </NavLink>
          <div className="menu-submenu ">
          <i className="menu-arrow"></i>
          <ul className="menu-subnav">
          <li className="menu-item  menu-item-parent" aria-haspopup="true">
            <span className="menu-link">
              <span className="menu-text">Configurações</span>
            </span>
          </li>
            <li className="menu-item menu-item-submenu " aria-haspopup="true" data-menu-toggle="hover">
              <NavLink className="menu-link menu-toggle" to="/tabela-precos">
                <span className="menu-text">Tabela de Preço</span>
              </NavLink>
            </li>
          </ul>
          </div>
        </li> */}
      </ul>
    </>
  );
}
