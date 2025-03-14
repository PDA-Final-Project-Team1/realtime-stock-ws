const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

// HTTP 서버 생성
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data.tr_id === "H0STCNT0" && data.tr_key) {
        console.log(`Subscribed to stock: ${data.tr_key}`);

        const interval = setInterval(() => {
          const stockData = generateStockData(data.tr_key);
          ws.send(stockData);
        }, 10);

        ws.on("close", () => {
          clearInterval(interval);
          console.log("Client disconnected");
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });
});

function generateStockData(stockCode) {
  const timestamp = new Date();
  const hours = timestamp.getHours().toString().padStart(2, "0");
  const minutes = timestamp.getMinutes().toString().padStart(2, "0");
  const seconds = timestamp.getSeconds().toString().padStart(2, "0");
  const time = `${hours}${minutes}${seconds}`;

  const price = (70000 + Math.random() * 2000).toFixed(0);
  const change = (-900 + Math.random() * 200 - 100).toFixed(0);
  const changeRate = ((change / price) * 100).toFixed(2);
  const avgPrice = (price * (1 + Math.random() * 0.01)).toFixed(2);
  const highPrice = (parseInt(price) + Math.floor(Math.random() * 300)).toFixed(
    0
  );
  const lowPrice = (parseInt(price) - Math.floor(Math.random() * 300)).toFixed(
    0
  );
  const volume = Math.floor(Math.random() * 15000000);
  const tradeValue = volume * price;
  const bidVolume = Math.floor(Math.random() * 70000);
  const askVolume = Math.floor(Math.random() * 70000);
  const netBuy = bidVolume - askVolume;
  const foreignHold = (Math.random() * 100).toFixed(2);
  const programBuy = Math.floor(Math.random() * 20000);
  const programSell = Math.floor(Math.random() * 20000);
  const programNetBuy = programBuy - programSell;
  const expectedPrice = (
    parseInt(price) + Math.floor(Math.random() * 50 - 25)
  ).toFixed(0);
  const totalTradeVolume = Math.floor(Math.random() * 20000000);

  return `0|H0STCNT0|001|${stockCode}^${time}^${price}^5^${change}^${changeRate}^${avgPrice}^${price}^${highPrice}^${lowPrice}^${price}^${price}^2^${volume}^${tradeValue}^${bidVolume}^${askVolume}^${netBuy}^${foreignHold}^${programBuy}^${programSell}^5^0.42^63.09^090004^3^0^090706^5^-400^091435^2^100^20250224^31^N^130115^59740^1126598^2083435^0.23^${totalTradeVolume}^73.11^0^^${expectedPrice}`;
}

app.get("/", (req, res) => {
  res.send("WebSocket Stock Server is running");
});
