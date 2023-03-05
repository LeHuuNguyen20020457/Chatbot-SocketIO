var userList = [
    {
        id: "1",
        username: "Nguyễn Phong Hào",
        room: "fe02"
    },
    {
        id: "2",
        username: "Đặng Trung Hiếu",
        room: "fe01"
    },
]

const addNewUser = (newUser) => {
   userList = [...userList, newUser]
}

const getRemoteUserList = (id) => {
    userList = userList.filter((user) => {
        return user.id !== id;
    })
}

const getUserList = (room) => {
    return userList.filter((user, index) => {
        return user.room === room
    })
}

module.exports = {getUserList, addNewUser, getRemoteUserList};
