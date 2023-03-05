//yêu cầu kết nối với server
var socket = io();

const formMessage = document.forms['form-messages']
const inputMessages = document.getElementById('input-messages')
const btnShareLocation = document.getElementById('btn-share-location')

formMessage.addEventListener('submit', function(e) {
    e.preventDefault()
    const messageText = inputMessages.value

    //acknowledments gửi thông báo cho người dùng họ có nhập đúng từ hợp lệ hay không
    const acknowledments = (notification) => {
        console.log(notification)
    }
    socket.emit("send message from client to server", messageText, acknowledments)
})
   
socket.on('send message from server to client', function(messages) {
    console.log(messages)
}) 

btnShareLocation.onclick = function(){

    //một số trình duyệt sẽ không hỗ trợ geolocation
    if(!navigator.geolocation){
        return alert('Trình duyệt không được hỗ trợ')
    }

    navigator.geolocation.getCurrentPosition(function(location) {

        const {latitude,longitude} = location.coords;
        socket.emit('send location from client to server', {latitude,longitude})
    })
}

socket.on('send location from server to client', function(linkLocation) {
    console.log(linkLocation)
})

//lấy params
const queryString = location.search

//bóc tách params
const params = Qs.parse(queryString, {
    ignoreQueryPrefix: true,
})

const {room, username} = params

socket.emit('join room from client to server', ({room , username}))

//xử lý user list
socket.on('send user list from server to client', (userList) => {
    console.log(userList)
})
