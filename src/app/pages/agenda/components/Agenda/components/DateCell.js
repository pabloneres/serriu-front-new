import React from "react";
import Utils from "./utils.js";
import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");


export default function DateCell(props) {
  const { date, text } = props.itemData;

  let propsDay = moment(date).format('DD/MM/YYYY')
  let day = moment(date).format('ddd')
  let dayNumber = moment(date).format('DD/MM/YYYY').split('/')

  let getCurrentDate = new Date()
  let currentDay = moment(getCurrentDate).format('DD/MM/YYYY')
  return (
    <div className="date-render-edit">
      {
        currentDay === propsDay ? 
        <div className="date_render_header">
          <div>{day}</div>
          <div  className="circle-today">{dayNumber[0]}</div>
        </div>
        : 
        <div className="date_render_header">
          <div>{day}</div>
          <div>{dayNumber[0]}</div>
        </div>
      } 
    </div>
  );
}
