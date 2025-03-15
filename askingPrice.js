const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

// HTTP 서버 생성
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.tr_id === 'H0STASP0' && data.tr_key) {
        // tr_key가 배열이면 그대로 사용, 단일 문자열이면 배열로 변환
        const stockCodes = Array.isArray(data.tr_key)
          ? data.tr_key
          : [data.tr_key];

        console.log(`Subscribed to order book: ${stockCodes.join(', ')}`);

        const interval = setInterval(() => {
          stockCodes.forEach((stockCode) => {
            const orderBookData = generateOrderBookData(stockCode);
            ws.send(orderBookData);
          });
        }, 1000);

        ws.on('close', () => {
          clearInterval(interval);
          console.log('Client disconnected');
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
});

/**
 * 주어진 종목코드에 대한 주문서 데이터를 생성합니다.
 *
 * @param {string} stockCode 종목 코드
 * @return {string} 생성된 주문서 데이터 문자열
 */
function generateOrderBookData(stockCode) {
  const timestamp = new Date();
  const hours = timestamp.getHours().toString().padStart(2, '0');
  const minutes = timestamp.getMinutes().toString().padStart(2, '0');
  const seconds = timestamp.getSeconds().toString().padStart(2, '0');
  const time = `${hours}${minutes}${seconds}`;

  // 각 섹션을 생성
  const section1 = generateSection1(); // 182100~183000, 10필드
  const section2 = generateSection2(); // 182000~181100, 10필드
  const section3 = generateSection3(); // 10필드: 첫번째는 117~189, 나머지는 100~300
  const section4 = generateSection4(); // 12필드: 400~600
  const fixedSection = getFixedSection(); // 나머지 14필드 (음수는 양수로 변환)

  // 모든 섹션을 합침
  const dataFields = [].concat(section1, section2, section3, section4, fixedSection);

  return `0|H0STASP0|001|${stockCode}^${time}^${dataFields.join('^')}`;
}

/**
 * 섹션 1: 182100부터 183000까지 100씩 증가하는 10개의 숫자 생성
 *
 * @return {Array<string>} 10개의 숫자 문자열
 */
function generateSection1() {
  const start = 182100;
  const count = 10;
  const section = [];
  for (let i = 0; i < count; i++) {
    section.push((start + i * 100).toString());
  }
  return section;
}

/**
 * 섹션 2: 182000부터 181100까지 100씩 감소하는 10개의 숫자 생성
 *
 * @return {Array<string>} 10개의 숫자 문자열
 */
function generateSection2() {
  const start = 182000;
  const count = 10;
  const section = [];
  for (let i = 0; i < count; i++) {
    section.push((start - i * 100).toString());
  }
  return section;
}

/**
 * 섹션 3: 첫 번째 필드는 117~189, 나머지 9개 필드는 100~300 사이의 랜덤 정수 생성 (총 10개)
 *
 * @return {Array<string>} 10개의 숫자 문자열
 */
function generateSection3() {
  const section = [];
  // 첫번째 필드: 117 ~ 189
  section.push(randomInt(117, 189).toString());
  // 나머지 9개 필드: 100 ~ 300
  for (let i = 0; i < 9; i++) {
    section.push(randomInt(100, 300).toString());
  }
  return section;
}

/**
 * 섹션 4: 400 ~ 600 사이의 랜덤 정수 12개 생성
 *
 * @return {Array<string>} 12개의 숫자 문자열
 */
function generateSection4() {
  const section = [];
  const count = 12;
  for (let i = 0; i < count; i++) {
    section.push(randomInt(400, 600).toString());
  }
  return section;
}

/**
 * 나머지 고정 섹션 생성
 * 원본: "0", "0", "0", "0", "14731", "-189300", "5", "-100.00", "764542", "0", "0", "0", "0", "0"
 * 음수는 모두 양수 처리
 *
 * @return {Array<string>} 14개의 숫자 문자열
 */
function getFixedSection() {
  const original = [
    '0',
    '0',
    '0',
    '0',
    '14731',
    '-189300',
    '5',
    '-100.00',
    '764542',
    '0',
    '0',
    '0',
    '0',
    '0',
  ];
  return original.map((num) => {
    // 소수점이 포함된 숫자인 경우 parseFloat 사용
    if (num.includes('.')) {
      return Math.abs(parseFloat(num)).toFixed(2);
    }
    return Math.abs(parseInt(num, 10)).toString();
  });
}

/**
 * min과 max(포함) 사이의 랜덤 정수를 반환합니다.
 *
 * @param {number} min 최소값
 * @param {number} max 최대값
 * @return {number} 랜덤 정수
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/', (req, res) => {
  res.send('WebSocket Order Book Server is running');
});