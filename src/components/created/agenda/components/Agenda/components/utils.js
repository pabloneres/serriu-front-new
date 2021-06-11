import { dinnerTime, holidays } from "./data.js";
import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

export default class Utils {
  static isHoliday(date) {
    const localeDate = date.toLocaleDateString();
    return (
      holidays.filter(holiday => {
        return holiday.toLocaleDateString() === localeDate;
      }).length > 0
    );
  }

  static isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  static isDinner(date) {
    const hours = date.getHours();
    return hours >= dinnerTime.from && hours < dinnerTime.to;
  }

  static hasCoffeeCupIcon(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return hours === dinnerTime.from && minutes === 0;
  }

  static isValidAppointment(component, appointmentData, days) {
    let startDate = new Date(appointmentData.startDate)
    let startWeek = startDate.getDay()
    let startHours = moment(startDate).format('HH:mm:ss').split(':')

    let currentDate = new Date()
    
    let endDate = new Date(appointmentData.endDate)
    let endtHours = moment(endDate).format('HH:mm:ss').split(':')

    startHours = `${startHours[0]}:${startHours[1]}`
    endtHours = `${endtHours[0]}:${endtHours[1]}`

    const returnFalse = days[startWeek].enable //true
    const returnFalse2 = startHours >= days[startWeek].start //true 
    const returnFalse3 = endtHours <= days[startWeek].end  //true
    const returnFalse4 = moment(startDate).isAfter(currentDate)  //true

    return returnFalse && returnFalse2 && returnFalse3 && returnFalse4
  }

  static isValidAppointmentRender(start, days) {
    let currentDate = new Date()
    let startDate = new Date(start)
    let startWeek = startDate.getDay()
    let startHours = moment(startDate).format('HH:mm:ss').split(':')
    startHours = `${startHours[0]}:${startHours[1]}`
    
    if (!days || days.length === 0) {
      return
    }
    
    const returnFalse = days[startWeek].enable
    const returnFalse2 = startHours >= days[startWeek].start 
    const returnFalse3 = startHours < days[startWeek].end 
    const returnFalse4 = moment(startDate).isAfter(currentDate)  //true


    return returnFalse && returnFalse2 && returnFalse3 && returnFalse4
  }

  static isValidAppointmentInterval(startDate, endDate, cellDuration) {
    const edgeEndDate = new Date(endDate.getTime() - 1);

    if (!Utils.isValidAppointmentDate(edgeEndDate)) {
      return false;
    }

    const durationInMs = cellDuration * 60 * 1000;
    const date = startDate;
    while (date <= endDate) {
      if (!Utils.isValidAppointmentDate(date)) {
        return false;
      }
      const newDateTime = date.getTime() + durationInMs - 1;
      date.setTime(newDateTime);
    }

    return true;
  }

  static isValidAppointmentDate(date) {
    return !Utils.isHoliday(date);
  }
}
