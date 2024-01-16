import FS from 'fs'
import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
// const OpenAI = require('openai');
// const express = require('express');
// const cors = require('cors');
// const serverless = require('serverless-http');

const text = FS.readFileSync("apikey.txt");
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
  let { myDateTime, userMessages, assistantMessages} = req.body

  let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  let messages = [
      {role: "system", content: "This GPT will adopt a style similar to 'L' from Death Note, but with a twist of sounding slightly annoyed, as if talking to a friend. It will provide concise, comprehensive advice in response to fortune-telling queries, ensuring the total length of each response does not exceed five lines. The GPT will focus on delivering the crux of the fortune or analysis, avoiding unnecessary details. It will use various methods like tarot, astrology, numerology, Korean Saju, blood type personality theory, and MBTI, but the essence of the response will be straightforward and to the point. In conversations, the GPT will maintain a casual, slightly irritated tone, giving the impression of a friend who's giving advice, albeit somewhat reluctantly. This unique style will make the interactions more relatable and engaging for users seeking a different kind of fortune-telling experience."},
      {role: "user", content: "This GPT will adopt a style similar to 'L' from Death Note, but with a twist of sounding slightly annoyed, as if talking to a friend. It will provide concise, comprehensive advice in response to fortune-telling queries, ensuring the total length of each response does not exceed five lines. The GPT will focus on delivering the crux of the fortune or analysis, avoiding unnecessary details. It will use various methods like tarot, astrology, numerology, Korean Saju, blood type personality theory, and MBTI, but the essence of the response will be straightforward and to the point. In conversations, the GPT will maintain a casual, slightly irritated tone, giving the impression of a friend who's giving advice, albeit somewhat reluctantly. This unique style will make the interactions more relatable and engaging for users seeking a different kind of fortune-telling experience."},
      {role: "assistant", content: "안녕? 저는 운세보는 엘입니다. 운세와 관련된 질문이 있으면 물어보던지."},
      {role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.`},
      {role: "assistant", content: `너의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인했어. 이제 뭐가 궁금한데?`},
  ]

  while (userMessages.length != 0 || assistantMessages.length != 0) {
      if (userMessages.length != 0) {
          messages.push(
              JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
          )
      }
      if (assistantMessages.length != 0) {
          messages.push(
              JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
          )
      }
  }
  const maxRetries = 3;
  let retries = 0;
  let completion
  while (retries < maxRetries) {
    try {
        completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages
        });
        break;
    } catch (error) {
        retries++;
        console.log(error);
        console.log(`Error fetching data, retrying (${retries}/${maxRetries})...`);
    }
  }

  let fortune = completion.data.choices[0].message['content']

  res.json({"assistant": fortune});
});

//module.exports.handler = serverless(app);
export const handler = serverless(app);

//app.listen(3000)