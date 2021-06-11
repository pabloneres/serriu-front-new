import React, {useState, useEffect} from "react";
import { Input } from 'antd';

const Especialidade = ({data}, callback) => {
  const [dados, setDados] = useState({})
  const [value, setValue] = useState()

  useEffect(() => {
    setDados(data)
    console.log(data)
  }, [data])

  const convertMoney = (value) => {
    if (!value) {
      return
    }
    return Number(value).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
  }

  return (
    <div
      className="info"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderBottom: 0,
      }}
    >
      <h2>
        {dados.name}: {convertMoney(dados.valor)}
      </h2>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default Especialidade;
