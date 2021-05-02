import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

export const atualData = () => {
  let atual = new Date()
  atual = moment(atual).format()

  var separados = atual.split(':')
  separados = separados[0] + ':' + separados[1]

  return separados
}