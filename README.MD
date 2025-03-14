# WebSocket 주식 체결가 & 호가 서버

이 프로젝트는 **Node.js**, **Express**, **WebSocket**을 사용하여 **실시간 주식 체결가 및 호가 데이터**를 제공하는 서버입니다.

## 🚀 주요 기능

- 실시간 주식 체결가 및 호가 데이터를 WebSocket을 통해 제공
- 초당 100개의 랜덤 주식 데이터를 전송
- 다중 클라이언트 연결 지원
- JSON이 아닌 문자열 포맷으로 데이터 제공

## 📌 설치 방법

1. 레포지토리 클론

   ```sh
   git clone https://github.com/your-repo/ws-stock-stream.git
   cd ws-stock-stream
   ```

2. 패키지 설치
   ```sh
   npm install
   ```

## ▶️ 실행 방법

### 서버 실행 (1) - currentPrice.js (체결가 데이터)

### tr_id: H0STCNT0

### port: 3000

```sh
node currentPrice.js
```

### 서버 실행 (2) - askingPrice.js (호가 데이터)

### tr_id: H0STASP0

### port: 3001

```sh
node askingPrice.js
```

## 💡 WebSocket 사용 예제 (JavaScript)

```javascript
const ws = new WebSocket("ws://localhost:3000"); // 체결가 서버 연결

ws.onopen = () => {
  ws.send(JSON.stringify({ tr_id: "H0STCNT0", tr_key: "005930" }));
};

ws.onmessage = (event) => {
  console.log("수신된 데이터:", event.data);
};

ws.onclose = () => {
  console.log("연결 종료");
};
```

```javascript
const ws = new WebSocket("ws://localhost:3001"); // 호가 서버 연결

ws.onopen = () => {
  ws.send(JSON.stringify({ tr_id: "H0STASP0", tr_key: "005930" }));
};

ws.onmessage = (event) => {
  console.log("수신된 데이터:", event.data);
};

ws.onclose = () => {
  console.log("연결 종료");
};
```

## 🔥 WebSocket 응답 포맷

### **1. 실시간 체결가 데이터** (`currentPrice.js`)

서버에서 전송하는 데이터는 아래와 같은 **문자열 포맷**을 따릅니다.

```
0|H0STCNT0|001|{종목코드}^{시간}^{체결가}^5^{전일대비}^전일대비율
```

예제 응답:

```
0|H0STCNT0|001|005930^093354^71900^5^-100^-0.14
```

### **2. 실시간 호가 데이터** (`askingPrice.js`)

호가 데이터는 아래와 같은 형식으로 전송됩니다.

```
0|H0STASP0|001|{종목코드}^{시간}^{암호화여부}^{매도호가1}^...^{매도호가10}^{매수호가1}^...^{매수호가10}^{총 매도호가 잔량}^{총 매수호가 잔량}^{예상 체결가}^{예상 체결량}^{누적 거래량}
```

예제 응답:

```
0|H0STASP0|001|005930^093730^0^71900^72000^72100^72200^72300^72400^72500^72600^72700^72800^71800^71700^71600^71500^71400^71300^71200^71100^71000^70900^91918^117942^92673^79708^106729^141988^176192^113906^134077^104229^95221^159371^220746^284657^212742^195370^182710^209747^376432^158171^1159362^2095167^0^0^0^0^525579^-72000^5^-100.00^3159115^0^8^0^0^0
```

## 📜 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
