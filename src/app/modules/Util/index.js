


export function conversorMonetario(number){

    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number)

}

export function formatDate(date) {
    if(date !== undefined)
    {
        var d = new Date(date);
    }
    else
    {
        var d = new Date();
    }
    
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}