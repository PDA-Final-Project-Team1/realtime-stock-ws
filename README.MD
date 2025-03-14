# WebSocket 주식 체결가 서버

이 프로젝트는 **Node.js**, **Express**, **WebSocket**을 사용하여 **실시간 주식 체결가 데이터**를 제공하는 서버입니다.

## 🚀 주요 기능

- 실시간 주식 체결가 데이터를 WebSocket을 통해 제공
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

### 서버 실행

```sh
npm start
```

## 💡 WebSocket 사용 예제 (JavaScript)

```javascript
const ws = new WebSocket("ws://localhost:3000");

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

## 🔥 WebSocket 응답 포맷

서버에서 전송하는 데이터는 아래와 같은 **문자열 포맷**을 따릅니다.

```
{종목코드}^{시간}^{체결가}^5^{전일대비}^전일대비율
```

예제 응답:

```
005930^093354^71900^5^-100^-0.14
```

## 📜 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
