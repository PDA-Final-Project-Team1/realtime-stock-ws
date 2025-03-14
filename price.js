const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const PORT = 3002;

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

  return `${stockCode}^${time}^0^71900^72000^72100^72200^72300^72400^72500^72600^72700^72800^71800^71700^71600^71500^71400^71300^71200^71100^71000^70900^91918^117942^92673^79708^106729^141988^176192^113906^134077^104229^95221^159371^220746^284657^212742^195370^182710^209747^376432^158171^1159362^2095167^0^0^0^0^525579^-72000^5^-100.00^3159115^0^8^0^0^0`;
}

app.get("/", (req, res) => {
  res.send("WebSocket Stock & Order Book Server is running");
});
