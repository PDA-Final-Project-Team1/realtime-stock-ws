const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const PORT = 3001;

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
        console.log(`Subscribed to stock price: ${data.tr_key}`);

        const interval = setInterval(() => {
          const stockData = generateStockData(data.tr_key);
          ws.send(stockData);
        }, 10);

        ws.on("close", () => {
          clearInterval(interval);
          console.log("Client disconnected");
        });
      } else if (data.tr_id === "H0STASP0" && data.tr_key) {
        console.log(`Subscribed to order book: ${data.tr_key}`);

        const interval = setInterval(() => {
          const orderBookData = generateOrderBookData(data.tr_key);
          ws.send(orderBookData);
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
  const price = (70000 + Math.random() * 2000).toFixed(0);
  const change = (Math.random() * 200 - 100).toFixed(0);
  const changeRate = ((change / price) * 100).toFixed(2);
  const timestamp = new Date();
  const hours = timestamp.getHours().toString().padStart(2, "0");
  const minutes = timestamp.getMinutes().toString().padStart(2, "0");
  const seconds = timestamp.getSeconds().toString().padStart(2, "0");
  const time = `${hours}${minutes}${seconds}`;

  return `${stockCode}^${time}^${price}^5^${change}^${changeRate}`;
}

function generateOrderBookData(stockCode) {
  const timestamp = new Date();
  const hours = timestamp.getHours().toString().padStart(2, "0");
  const minutes = timestamp.getMinutes().toString().padStart(2, "0");
  const seconds = timestamp.getSeconds().toString().padStart(2, "0");
  const time = `${hours}${minutes}${seconds}`;

  let askPrices = Array.from({ length: 10 }, (_, i) =>
    (70000 + i * 100 + Math.random() * 50).toFixed(0)
  );
  let bidPrices = Array.from({ length: 10 }, (_, i) =>
    (69800 - i * 100 - Math.random() * 50).toFixed(0)
  );
  let askVolumes = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 100000)
  );
  let bidVolumes = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 100000)
  );
  let totalAskVolume = askVolumes.reduce((a, b) => a + b, 0);
  let totalBidVolume = bidVolumes.reduce((a, b) => a + b, 0);
  let expectedPrice = askPrices[0];
  let expectedVolume = Math.floor(Math.random() * 100000);
  let totalTradeVolume = totalAskVolume + totalBidVolume;

  return `${stockCode}^${time}^0^${askPrices.join("^")}^${bidPrices.join(
    "^"
  )}^${askVolumes.join("^")}^${bidVolumes.join(
    "^"
  )}^${totalAskVolume}^${totalBidVolume}^${expectedPrice}^${expectedVolume}^${totalTradeVolume}`;
}

app.get("/", (req, res) => {
  res.send("WebSocket Stock & Order Book Server is running");
});
