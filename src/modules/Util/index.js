import moment from "moment";
import "moment/locale/pt-br";
import local from "antd/es/date-picker/locale/pt_BR";
moment.locale("pt-br");

export function convertMoney(value) {
  if (!value) {
    return Number(0).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }
  return Number(value).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
};

export function convertDate(data) {
  return moment(data).format("L") + " - " + moment(data).format("LT");
};

export function currencyToInt(value) {
  value = value.replace(/[^0-9]+/g, "");
  value = value.slice(0, -2) + "." + value.slice(-2);

  return value;
}

export function upperFirst(value) {
  let newValue = value[0].toUpperCase() + value.substr(1)
  return newValue;
}
