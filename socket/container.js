const currentUsers = [];

const addUser = ({ socketId, userName, movieRoom }) => {
    userName = userName.trim().toLowerCase();
    movieRoom = movieRoom.trim().toLowerCase();

    const existingUser = currentUsers.find(user => user.userName === userName);

    if (existingUser) {
        removeUser(existingUser.socketId);
    }

    const user = { socketId, userName, movieRoom };

    currentUsers.push(user);

    return user;
};

const removeUser = socketId => {
    const index = currentUsers.findIndex(user => user.socketId === socketId);

    if (index !== -1) {
        return currentUsers.splice(index, 1)[0];
    }
};

const getUser = socketId => currentUsers.find(user => user.socketId === socketId);

module.exports = { addUser, removeUser, getUser };
