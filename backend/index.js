const fs = require('fs');
const OpenAI = require('openai');
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const { resolve } = require('path');

const text = fs.readFileSync("apikey.txt");
const apiKey = text.toString();

const app = express()
const openai = new OpenAI({
  apiKey: apiKey
});

//CORS 이슈 해결
const whitelist = ["https://chat-lawliet.pages.dev"];
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      console.log(whitelist.indexOf(origin))
      callback(null, true);
    } else {
      callback(new Error("Not Allowed Origin!"));
    }
  },
  credentials: true
};

//app.use(cors(corsOptions));
app.use(cors());

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// POST method route
app.post('/fortuneTell', async function (req, res) {
  let { myDateTime, userMessage, threadId } = req.body
  let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const assistantId = "asst_Tah40NyyFIOzPbRr1OCwhmRK";

  if (threadId == ''){
    const emptyThread = await openai.beta.threads.create();
    threadId = emptyThread.id;
    await openai.beta.threads.messages.create(
        threadId,
        {role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.`}
    );
  }
  await openai.beta.threads.messages.create(
    threadId,
    { role: "user", content: userMessage }
  );

  let run = await openai.beta.threads.runs.create(
    threadId,
    { assistant_id: assistantId }
  );

  while (run.status != "completed"){
    run = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      );
    await new Promise((resolve) => setTimeout(resolve, 500));   //0.5sec
  }

  const threadMessages = await openai.beta.threads.messages.list(threadId);
  assistantLastMsg = threadMessages.data[0].content[0].text.value

  res.json({"assistant": assistantLastMsg, "threadId": threadId});
});

app.listen(3000)
//module.exports.handler = serverless(app);