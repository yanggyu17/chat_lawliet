# chat_lawliet
운세보는 엘

https://chat-lawliet.pages.dev

## 개발 계획

- 엘 대화 Ui 변경

- 엘ai 캐릭터성 추가
1. 엘 음성파일로 OpenAI의 whisper을 사용하여 대본 작성
2. prompty(GPT 세팅방법을 알려주는 GPT)에게 instructions 세팅 도움
3. prompty에게 받은 내용을 번역 후 엘 GPTs Instructions에 투입. 추후 음성 지원도 위한 일본어 대답 옵션도 추가.

- 음성지원 추가
1. 상기 작성한 일본어 대본을 사용하여 TTS 학습
2. GPTs의 답변을 TTS와 결합
