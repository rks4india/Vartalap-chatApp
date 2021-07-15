var date = new Date();
var hours = date.getHours();
var minutes = date.getMinutes();
var ampm = hours>=12 ? 'pm':'am';
hours = hours%12;
hours = hours ? hours : 12;
var time = hours+':'+minutes+' '+ampm;

const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".msg-container");
// const timeContainer = document.querySelector(".name");
const roomName = document.getElementById('room-name')
const userList = document.getElementById("users");
// const usersCount = document.getElementById('usersCount');

var audio = new Audio('/ring.mp3');

// Get username and room
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
// console.log(username, room);

// Join chatroom
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users}) =>{
    outputRoomName(room);
    outputUsers(users);
    console.log(users);
    window.numberOfUsers = Object.values(users).length;
    // console.log(window.numberOfUsers);
});


const append = (message, name, position, time)=>{
    const messageContent = document.createElement('p');
    messageContent.innerText = message;
    messageContent.classList.add('message');
    messageContent.classList.add(position);
    
    const messageName = document.createElement('h4');    
    messageName.innerText = name;
    messageName.innerHTML += `<span>${time}</span>`;
    messageName.classList.add('name');
    messageName.classList.add(position);       

    
    messageContainer.append(messageName);           
    messageContainer.append(messageContent);     
    if(position == 'left'){
        audio.play();
    }
}
  
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(window.numberOfUsers == 1){
        alert("You are alone in the room. Wait for other user to chat with!");
        console.log(numberOfUsers)
    }
    else{
        console.log(numberOfUsers)
        const message = messageInput.value;    
        append(`${message}`,'You', 'right', `${time}`);
        socket.emit('send', message);
        messageInput.value = '';
        messageContainer.scrollTop = messageContainer.scrollHeight;
        e.target.elements.message.focus();    
    }
})

form.addEventListener('leave', ()=>{
    socket.emit('disconnect', message);
})

const name = username;
console.log(name);
// const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name)


socket.on('user-joined', name=>{
    append(`${name} joined the chat`,'', 'center','');
    console.log(`${name} joined the chat`, 'center');
})

socket.on('receive', data=>{      
    append(`${data.message}`,`${data.name}`, 'left', `${time}`)
    console.log(data.time);
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

socket.on('left', name=>{
    append(`${name} left the chat`,'','center', '');    
})

// Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

// Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the Chatroom?');
    if(leaveRoom){
        window.location = '../index.html';
    }
    else{}
})


