import React, {useMemo} from "react";
import {useHtmlClassService} from "../../../_core/MetronicLayout";
import { useSelector } from "react-redux";

import {AsideMenuListMaster} from "./AsideMenuListMaster";
import {AsideMenuListMatriz} from "./AsideMenuListMatriz";
import {AsideMenuListFilial} from "./AsineMenuListFilial";

export function AsideMenu({disableScroll}) {
  const {user} = useSelector((state) => state.auth);
  console.log(user[0].access_level)
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      layoutConfig: uiService.config,
      asideMenuAttr: uiService.getAttributes("aside_menu"),
      ulClasses: uiService.getClasses("aside_menu_nav", true),
      asideClassesFromConfig: uiService.getClasses("aside_menu", true)
    };
  }, [uiService]);

  function ReturnAside(props) {
    if (user[0].access_level === 1) {
      return <AsideMenuListMaster layoutProps={props} />
    }

    if (user[0].access_level === 2) {
      return <AsideMenuListMatriz layoutProps={props} />
    }

    if (user[0].access_level === 3) {
      return <AsideMenuListFilial layoutProps={props} />
    }
  }

  return (
    <>
      {/* begin::Menu Container */}
      <div
        id="kt_aside_menu"
        data-menu-vertical="1"
        className={`aside-menu my-4 ${layoutProps.asideClassesFromConfig}`}
        {...layoutProps.asideMenuAttr}
      >
        <ReturnAside layoutProps={layoutProps} />
      </div>
      {/* end::Menu Container */}
    </>
  );
}
