import React, { useState, useEffect } from "react";
import "./style.css";

const App = () => {
  const [currencies, setCurrencies] = useState([]); // Lista de moedas disponíveis
  const [fromCurrency, setFromCurrency] = useState("USD"); // Moeda de origem
  const [toCurrency, setToCurrency] = useState("BRL"); // Moeda de destino
  const [amount, setAmount] = useState(1); // Valor a ser convertido
  const [convertedAmount, setConvertedAmount] = useState(null); // Valor convertido

  // Carregar lista de moedas ao iniciar o app
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((response) => response.json())
      .then((data) => setCurrencies(Object.keys(data.rates)))
      .catch((error) => console.error("Erro ao buscar moedas:", error));
  }, []);

  // Função que executa a conversão automaticamente ao alterar o valor
  const handleAmountChange = (value) => {
    setAmount(value);
    
    if (value === "" || isNaN(value)) {
      setConvertedAmount(null);
      return;
    }

    fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
      .then((response) => response.json())
      .then((data) => {
        const rate = data.rates[toCurrency]; // Pega a taxa de câmbio
        setConvertedAmount((value * rate).toFixed(2)); // Converte e formata o valor
      })
      .catch((error) => console.error("Erro ao converter:", error));
  };

  return (
    <div style={{ padding: "16px", fontFamily: "Arial" }}>
      <h2>Conversor de Moedas</h2>

      <div>
        <label>De: </label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Para: </label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Valor: </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
        />
      </div>

      {convertedAmount !== null && (
        <p>
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </p>
      )}
    </div>
  );
};

export default App;
