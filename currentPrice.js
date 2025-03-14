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

        // 랜덤 주가 데이터를 주기적으로 전송 (1초당 100개)
        const interval = setInterval(() => {
          const stockData = generateStockData(data.tr_key);
          ws.send(stockData);
        }, 10); // 10ms마다 1개씩 전송 (100개/초)

        // 클라이언트 연결 종료 시 setInterval 해제
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

// 랜덤 주가 데이터 생성 함수
function generateStockData(stockCode) {
  const price = (70000 + Math.random() * 2000).toFixed(0); // 70000~72000원 사이 랜덤 가격
  const change = (Math.random() * 200 - 100).toFixed(0); // -100 ~ +100 랜덤 변동폭
  const changeRate = ((change / price) * 100).toFixed(2); // 변동률 계산
  const timestamp = new Date();
  const hours = timestamp.getHours().toString().padStart(2, "0");
  const minutes = timestamp.getMinutes().toString().padStart(2, "0");
  const seconds = timestamp.getSeconds().toString().padStart(2, "0");
  const time = `${hours}${minutes}${seconds}`;

  return `${stockCode}^${time}^${price}^5^${change}^${changeRate}`;
}

app.get("/", (req, res) => {
  res.send("WebSocket Stock Server is running");
});
