/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { 
  ToolOutlined,
  MenuOutlined,
  CalendarOutlined,
  SmileOutlined,
  DollarOutlined,
  UserOutlined,
  InfoCircleOutlined,
  RobotOutlined
} from '@ant-design/icons'

export function AsideMenuListFilial({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };


  const menus = [
    { 
      title: 'Dashboard',
      icon: <MenuOutlined/>,
      role: 'dashboard',
      to: '/dashboard'
    },
    {
      title: 'Administrador',
      icon: <RobotOutlined/>,
      role: 'administrador',
      to: '/administrador',
      children: [
        {
          title: 'Clinicas',
          role: 'clinics',
          to: '/clinicas'
        }
      ]
    },
    { 
      title: 'Agenda',
      icon: <CalendarOutlined/>,
      role: 'schedule',
      to: '/agenda'
    },
    { 
      title: 'Pacientes',
      icon: <SmileOutlined/>,
      role: 'patients',
      to: '/pacientes'
    },
    { 
      title: 'Financeiro',
      icon: <DollarOutlined/>,
      role: 'financial',
      to: '/financeiro'
    },
    {
      title: 'Usúarios',
      icon: <UserOutlined/>,
      role: 'users',
      to: '/usuarios',
      children: [
        {
          title: 'Adicionar usuário',
          role: 'addUser',
          to: '/usuario/adicionar'
        },
        {
          title: 'Dentistas',
          role: 'dentists',
          to: '/dentista'
        },
        {
          title: 'Recepcionistas',
          role: 'recepcionist',
          to: '/recepcionista'
        }
      ]
    },
    { 
      title: 'Informações',
      icon: <InfoCircleOutlined/>,
      role: 'infos',
      to: '/financeiro'
    },
    { 
      title: 'Configurações',
      icon: <ToolOutlined/>,
      role: 'settings',
      to: '/configuracoes',
      children: [
        {
          title: 'Geral',
          to: '/configuracao_geral',
          role: ''
        },
        {
          title: 'Tabela de Preços',
          to: '/tabela-precos',
          role: ''
        },
        {
          title: 'Tabela de Especialidades',
          to: '/tabela-especialidades',
          role: ''
        },
        {
          title: 'Equipamentos',
          to: '/equipamentos',
          role: ''
        },
        {
          title: 'Relatorios',
          to: '/relatorios',
          role: ''
        },
        {
          title: 'Agenda',
          to: '/configurar-agenda',
          role: ''
        },
      ]
    },
  ]

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        {
          menus.map(item => (
            <li
              key={item.role}
              className={`menu-item menu-item-submenu ${getMenuItemActive(item.to, false)}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to={item.to}>
                <span className="svg-icon menu-icon">
                  {item.icon}
                  {/* <SVG style={{ "fill": "#3699FF" }} src={toAbsoluteUrl("/media/svg/icons/Design/users.svg")} /> */}
                </span>
                <span className="menu-text">{item.title}</span>
                {item.children ? <i className="menu-arrow" ></i> : ""}
              </NavLink>
              {
                item.children ? (
                  <div className="menu-submenu ">
                    <i className="menu-arrow"></i>
                    <ul className="menu-subnav">
                      <li className="menu-item  menu-item-parent" aria-haspopup="true">
                        <span className="menu-link">
                          <span className="menu-text">{item.title}</span>
                        </span>
                      </li>
                      {
                        item.children.map((children, index) => (
                          <li key={index} className="menu-item menu-item-submenu " aria-haspopup="true" data-menu-toggle="hover">
                            <NavLink className="menu-link menu-toggle" to={children.to}>
                              <span className="menu-text">{children.title}</span>
                            </NavLink>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                ) : ''
              }
            </li>
          ))
        }
      </ul>
    </>
  );
}
