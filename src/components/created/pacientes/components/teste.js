let valores = []

let arr = [
  {
      id: 1,
      nome: 'Pablo',
      valor: 100,
      valorAplicado: 0
  },
  {
      id: 1,
      nome: 'Pablo',
      valor: 100,
      valorAplicado: 0
  },
  {
      id: 1,
      nome: 'Pablo',
      valor: 100,
      valorAplicado: 0
  },
  {
      id: 2,
      nome: 'Iago',
      valor: 100,
      valorAplicado: 0
  }
]

arr.forEach((item) => {
  if (!valores.some((el, i) => el.id === item.id)) {
    valores.push(item)
  } else {
    var index = valores.findIndex(current => item.id === current.id)

    valores[index].valor = valores[index].valor + item.valor
  }
})


// console.log(valores)
let value = valores
const setValue = (valor) => {
  value = valor
}

// let novo = {
//   id: 4,
//   nome: 'Pablo',
//   valor: 4400,
//   valorAplicado: 1033
// }

// // let newArr = [novo, ...valores]

// setValue(valores.map((current, i) => {
//   if (i === 0) {
//     return {...current, valorAplicado: 100}
//   } else {
//     return {...current}
//   }
// }))
// setValue(valores.map((current, i) => {
//   if (i === 0) {
//     return {...current, valorAplicado: 100}
//   } else {
//     return {...current}
//   }
// }))

let saldoDistribuir = []

const arr = saldoDistribuir.map((current) => {
  if (item === current) {
    return item
  } else {
    return current
  }
})


function teste () {
  
  setValue(arr)
}

console.log(value)
// const handleChangeValueEspecialidade = (e, index, item) => {
//   var arr = valores
//   var modified = {...item, valorAplicado: e}
//   // console.log(modified)
//   arr[index] = modified

//   return console.log(arr)
// }


// handleChangeValueEspecialidade(100, 0, valores[0])

// console.log(valores)

   // function unico(a) {
          //   var jaVisto = {};
          //   return arrEspecialidades.filter(function(item) {
          //       return jaVisto.hasOwnProperty(item) ? false : (jaVisto[item] = true);
          //   });
          // }