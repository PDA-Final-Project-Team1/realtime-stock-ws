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
      if (data.tr_id === "H0STASP0" && data.tr_key) {
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

function generateOrderBookData(stockCode) {
  const timestamp = new Date();
  const hours = timestamp.getHours().toString().padStart(2, "0");
  const minutes = timestamp.getMinutes().toString().padStart(2, "0");
  const seconds = timestamp.getSeconds().toString().padStart(2, "0");
  const time = `${hours}${minutes}${seconds}`;

  return `0|H0STASP0|001|${stockCode}^${time}^0^182100^182200^182300^182400^182500^182600^182700^182800^182900^183000^182000^181900^181800^181700^181600^181500^181400^181300^181200^181100^117^1357^19^44^153^149^112^276^194^189^8187^4325^4099^2881^5314^7276^1228^1941^2628^3477^2610^41356^0^0^0^0^14731^-189300^5^-100.00^764542^0^0^0^0^0`;
}

app.get("/", (req, res) => {
  res.send("WebSocket Order Book Server is running");
});
