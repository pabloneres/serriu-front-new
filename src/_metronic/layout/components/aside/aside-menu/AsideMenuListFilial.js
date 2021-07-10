/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux'
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
  const { selectedClinic } = useSelector(state => state.clinic)
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };


  const menus = [
    {
      title: 'Dashboard',
      icon: <MenuOutlined />,
      role: 'dashboard',
      to: '/dashboard'
    },
    {
      title: 'Administrador',
      icon: <RobotOutlined />,
      role: 'administrador',
      to: '/administrador',
      children: [
        {
          title: 'Clinicas',
          role: 'clinics',
          to: '/clinicas'
        },
        {
          title: 'Cargos',
          role: 'cargos',
          to: '/cargos'
        },
        {
          title: 'Equipamentos',
          role: 'esps',
          to: '/esps'
        }
      ]
    },
    {
      title: 'Agenda',
      icon: <CalendarOutlined />,
      if: ['selectedClinic'],
      role: 'schedule',
      to: '/agenda'
    },
    {
      title: 'Pacientes',
      icon: <SmileOutlined />,
      if: ['selectedClinic'],
      role: 'patients',
      to: '/pacientes'
    },
    {
      title: 'Financeiro',
      icon: <DollarOutlined />,
      if: ['selectedClinic'],
      role: 'financial',
      to: '/financeiro'
    },
    {
      title: 'Usúarios',
      icon: <UserOutlined />,
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
      icon: <InfoCircleOutlined />,
      if: ['selectedClinic'],
      role: 'infos',
      to: '/informacoes'
    },
    {
      title: 'Configurações',
      icon: <ToolOutlined />,
      role: 'settings',
      if: ['selectedClinic'],
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
          title: 'Laboratórios',
          to: '/laboratorios',
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


  const ifs = {
    selectedClinic: Object.keys(selectedClinic).length === 0 ? true : false
  }

  const Menu = ({menu}) => {
    return (
      <li
        className={`menu-item menu-item-submenu ${getMenuItemActive(menu.to, false)}`}
        aria-haspopup="true"
        data-menu-toggle="hover"
      >
        <NavLink className="menu-link menu-toggle" to={menu.to}>
          <span className="svg-icon menu-icon">
            {menu.icon}
            {/* <SVG style={{ "fill": "#3699FF" }} src={toAbsoluteUrl("/media/svg/icons/Design/users.svg")} /> */}
          </span>
          <span className="menu-text">{menu.title}</span>
          {menu.children ? <i className="menu-arrow" ></i> : ""}
        </NavLink>
        {
          menu.children ? (
            <div className="menu-submenu ">
              <i className="menu-arrow"></i>
              <ul className="menu-subnav">
                <li className="menu-item  menu-item-parent" aria-haspopup="true">
                  <span className="menu-link">
                    <span className="menu-text">{menu.title}</span>
                  </span>
                </li>
                {
                  menu.children.map((children, index) => (
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
    )
  }

  const permitied = (role) => {
    return role.map(cond => ifs[cond])
  }

  const ReturnMenu = ({menu}) => {
    if (menu.if) {
      return permitied(menu.if)[0] === true ? <></> : <Menu menu={menu} />
    } 
    return (
      <Menu menu={menu} />
    )
  }

  const ReturnMenusList = () => (
    menus.map(menu => (
      <ReturnMenu menu={menu} />
    ))
  )

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <ReturnMenusList/>
      </ul>
    </>
  );
}