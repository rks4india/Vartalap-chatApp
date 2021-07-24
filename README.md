## Stay connected with your friends  and loved ones with your own group chat app
<img src="https://raw.githubusercontent.com/rks4india/Vartalap-chatApp/master/public/chatApp.png" width="100%">

## A Realtime chat application built with Node.js and socket.io.

### Chat features
* Login with your Username and select your chatroom.
* If you are alone in the chatroom, you can't send message.
* Wait for somebody else to come in the chatroom in order the chat.
* When a new user enters into the room, the server will broadcast the message of joining of the user to all other users in the Chatroom.
* It supports multi-persons group chat.
* This project uses websockets for real time bi directional data transfer.
* When a user closes the browser window or clicks on "Leave Chatroom" button, server will broadcast a message of leaving of that user to all the users present in the Chatroom.

---
### How to run
1. Download the code then extract
2. Download Nodejs (https://nodejs.org/en/) and install. If already installed then ignore.
3. Set the path of Nodejs (Path of 'bin' folder to be set as user environment variable).
4. Open the terminal (or Use Ctrl + backtick character)
5. Navigate to directory `cd .\Vartalap-chatApp-master`
6. Install all npm dependencies `npm install`
7. Start the server `npm start node` 
8. Open two or more tabs in your browsers with address `http://127.0.0.1:5000` and choose same Room to enjoy chatting.
