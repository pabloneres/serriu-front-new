import React, { useState, useEffect } from 'react';

// import { Container } from './styles';
import { Table, Card, Button } from 'antd'
import { convertMoney } from '~/modules/Util'



function TableTotal({ orcamento, executarProcedimento }) {

  const [especialidades, setEspecialidades] = useState([])

  useEffect(() => {
    let especialidades = []

    orcamento.procedimentos.forEach(element => {
      var index = especialidades.findIndex((current) => element.procedimento.especialidade_id === current.id)
      if (index === -1) {
        especialidades.push(element.procedimento.especialidade)
      }
    });  // separa todas as especialidades presentes no orçamento

    orcamento.procedimentos.forEach(element => {
      var index = especialidades.findIndex((current) => element.procedimento.especialidade_id === current.id)

      // element = {
      //   created_at: element.created_at,
      //   data_execucao: element.data_execucao,
      //   dente: element.dente,
      //   dentista: element.dentista,
      //   dentista_id: element.dentista_id,
      //   desconto: element.desconto,
      //   detalhes: element.detalhes,
      //   faces: element.faces,
      //   id: element.id,
      //   orcamento_id: element.orcamento_id,
      //   procedimento_id: element.procedimento_id,
      //   status_execucao: element.status_execucao,
      //   status_pagamento: element.status_pagamento,
      //   updated_at: element.updated_at,
      //   valor: element.valor,
      // } //corrige os dados e tira elementos que não serão usados  // desativado

      if (!especialidades[index].procedimentos) {
        especialidades[index].procedimentos = []
        especialidades[index].total = 0
        especialidades[index].saldo = 0
      } // cria uma propriedade nas especialidades para evitar erros

      var indexProcedimento = especialidades[index].procedimentos.findIndex((current) => element.id === current.id) // verifica se já existe o procedimento 

      if (indexProcedimento === -1) {
        especialidades[index].procedimentos.push(element)
      } // se não existir adiciona o procedimento na especialidade e o valor
    })

    especialidades = especialidades.map((element) => ({
      ...element,
      total: element.procedimentos.reduce((a, b) => a + b.desconto, 0)
    })) // soma os totais dos procedimentos e adiciona na variavel "total"

    orcamento.saldoEspecialidade.forEach((element) => {
      var index = especialidades.findIndex((current) => element.especialidade_id === current.id)

      if (especialidades[index]) {
        especialidades[index].saldo = element.saldo
      }

    })

    setEspecialidades(especialidades)
    console.log(especialidades)

  }, [orcamento])

  return (
    <div>
      {especialidades.map(especialidade => {
        console.log(especialidade.procedimentos)
        return (
          <Card title={especialidade.name}
            extra={Extra(especialidade.total, especialidade.saldo)}
          >
            <Table
              columns={[
                {
                  title: 'Dente',
                  dataIndex: 'dente',
                  render: (data) => <span>{data ? data : "Geral"}</span>
                },
                {
                  title: 'Procedimento',
                  dataIndex: 'procedimento',
                  render: (data) => <span>{data.name}</span>
                },
                {
                  title: 'Face',
                  dataIndex: 'faces',
                  render: (data) => <span>{data ? data.map(item => {
                    return (
                      <span style={{ color: "red" }}>
                        {item.label}
                      </span>
                    )
                  }) : '-'}</span>
                },
                {
                  title: 'Avaliador',
                  dataIndex: 'dentista',
                  render: (data) => <span>{data.firstName} {data.lastName}</span>,
                },
                {
                  title: 'Valor',
                  dataIndex: 'desconto',
                  render: (data) => <span>{convertMoney(data)}</span>
                },
                {
                  width: 120,
                  render: (data) => (
                    <Button
                      type="primary"
                      disabled={data.desconto > orcamento.saldo || data.status_execucao === 'executado'}
                      onClick={(e) =>
                        executarProcedimento(e, orcamento, data)
                      }
                    >
                      {/* {console.log(data)}
                      {console.log(especialidade.saldo)} */}
                      {data.status_execucao === 'executado' ? 'Executado' : 'Executar'}
                    </Button>)
                },
              ]}
              dataSource={especialidade.procedimentos}
              pagination={false}
            />
          </Card>
        )
      })}
    </div>
  )
}

export default TableTotal;

const Extra = (total, saldo) => {
  return (
    <div style={{ display: 'flex' }}>
      <span style={{ marginRight: 20 }}>Total: {convertMoney(total)}</span>
      <span style={{ color: 'green', fontWeight: 'bold' }}>Saldo: {convertMoney(saldo)}</span>
    </div>
  )
}


// useEffect(() => {
  //   if (orcamento.pagamento) {

  //     console.log(orcamento.pagamento)
  //     console.log(orcamento.pagamentos)
  //     console.log(orcamento.procedimentos)

  //     setSelecionado(orcamento.procedimentos.map((item) => ({ ...item, key: item.id })));

  //     setPagamentoValue2(orcamento.restante);

  //     if (orcamento.pagamentos.length === 0) {
  //       let arrEspecialidades = orcamento.procedimentos.map((item) => ({
  //         procedimentos: [item],
  //         id: item.procedimento.especialidade.id,
  //         name: item.procedimento.especialidade.name,
  //         valor: item.desconto,
  //         restante: item.desconto,
  //         valorAplicado: Number(),
  //       }))

  //       let valores = []

  //       console.log(arrEspecialidades)

  //       arrEspecialidades.forEach((item) => {
  //         if (!valores.some((el, i) => el.id === item.id)) {
  //           valores.push(item);
  //         } else {
  //           var index = valores.findIndex(
  //             (current) => item.id === current.id
  //           );

  //           valores[index].valor = valores[index].valor + item.valor;
  //           valores[index].procedimentos = [...valores[index].procedimentos, item.procedimentos[0]]
  //         }
  //       });

  //       const especi = valores.map((item) => ({
  //         ...item,
  //         restante: item.valor,
  //       }))

  //       console.log(especi)

  //       setEspecialidades(especi);
  //       setSaldoDistribuir(especi);

  //       return;
  //     } else {

  //       let especialidadesSemRestante = [];

  //       let especialidadesOrcamento = orcamento.procedimentos.map((item) => {
  //         return {
  //           procedimentos: [item],
  //           id: item.procedimento.especialidade.id,
  //           name: item.procedimento.especialidade.name,
  //           valor: Number(item.desconto),
  //           valorAplicado: Number(),
  //         }
  //       });

  //       console.table(especialidadesOrcamento)
  //       // console.table()

  //       especialidadesOrcamento.forEach((item) => {
  //         if (
  //           !especialidadesSemRestante.some((el, i) => el.id === item.id)
  //         ) {
  //           especialidadesSemRestante.push(item);
  //         } else {
  //           var index = especialidadesSemRestante.findIndex(
  //             (current) => item.id === current.id
  //           );
  //           especialidadesSemRestante[index].valor =
  //             especialidadesSemRestante[index].valor + item.valor;

  //           especialidadesSemRestante[index].procedimentos = [...especialidadesSemRestante[index].procedimentos, item.procedimentos[0]]
  //         }
  //       });

  //       console.log(especialidadesOrcamento)

  //       especialidadesSemRestante = especialidadesSemRestante.map(
  //         (item) => ({
  //           ...item,
  //           restante: item.valor,
  //         })
  //       );

  //       console.log(especialidadesSemRestante)

  //       ////////////////////////////////////////////////

  //       let especialidadesComRestante = [];


  //       let arrEspecialidades = orcamento.pagamentos.map((item) => {
  //         console.log(item)
  //         return {
  //           id: item.especialidades.id,
  //           name: item.especialidades.name,
  //           valor: Number(item.valor),
  //           restante: Number(item.restante),
  //           valorAplicado: Number(),
  //         }
  //       });

  //       arrEspecialidades.forEach((item) => {
  //         if (
  //           !especialidadesComRestante.some((el, i) => el.id === item.id)
  //         ) {
  //           especialidadesComRestante.push(item);
  //         } else {
  //           var index = especialidadesComRestante.findIndex(
  //             (current) => item.id === current.id
  //           );

  //           especialidadesComRestante[index] = item;
  //         }
  //       });

  //       console.log(arrEspecialidades)



  //       ///////////////////////////////////////////////

  //       let especialidadeDiferenca = [];

  //       especialidadesSemRestante.forEach((item) => {
  //         if (
  //           !especialidadesComRestante.some((el, i) => el.id === item.id)
  //         ) {
  //           especialidadeDiferenca.push(item);
  //         } else {
  //           return;
  //         }
  //       });

  //       ///////////////////////////////////////////////

  //       let especialidadesFinal = [
  //         ...especialidadesComRestante,
  //         ...especialidadeDiferenca,
  //       ];

  //       console.table(especialidadesFinal)

  //       setEspecialidades(especialidadesFinal);
  //       setSaldoDistribuir(especialidadesFinal);
  //     }
  //   }
  // }, [orcamento])