import React from "react";
import Utils from "./utils.js";
import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");


export default function DateCell(props) {
  const { date, text } = props.itemData;
  const isWeekend = Utils.isWeekend(date);

  const getCurrentDate = new Date(date)
  const currentDate = new Date()
  return (
    <div className="date-render-edit">
      {
        getCurrentDate.getDate() === currentDate.getDate() ? 
        <div className="circle-today">
          <div>{text}</div>
        </div>
        : <div>{text}</div>
      } 
    </div>
  );
}
