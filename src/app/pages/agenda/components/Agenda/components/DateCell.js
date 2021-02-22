import React from "react";
import Utils from "./utils.js";

export default function DateCell(props) {
  const { date, text } = props.itemData;
  const isWeekend = Utils.isWeekend(date);

  // console.log(isWeekend)
  return (
    <div className={isWeekend ? "disable-collumn-date" : null}>
      <div>{text}</div>
    </div>
  );
}
