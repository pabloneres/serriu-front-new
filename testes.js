let arr = [
  {
    label: 'pablo',
    hora: '12:00'
  },
  {
    label: 'iago',
    hora: '13:00'
  },
  {
    label: 'ryan',
    hora: '15:00'
  },
  {
    label: 'zena',
    hora: '06:00'
  },
  {
    label: 'luana',
    hora: '22:30'
  },
  {
    label: 'pamela',
    hora: '23:05'
  },
  {
    label: 'pai',
    hora: '12:30'
  },
  {
    label: 'zick',
    hora: '11:50'
  },
]

let ordenedArr = arr.sort((a, b) => {
  return a.hora < b.hora ? -1 : a.hora > b.hora ? 1 : 0;
})

console.log(ordenedArr)