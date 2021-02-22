import React from "react";
import Utils from "./utils.js";

export default function DataCell(props) {
  const { startDate, text } = props.itemData;
  const isDisableDate = Utils.isValidAppointmentRender(startDate, props.days)

  // console.log(isDisableDate)
  const cssClasses = [];

  if (!isDisableDate) {
    cssClasses.push("disable-date");
  }
  return <div className={cssClasses}>{text}</div>;
}
