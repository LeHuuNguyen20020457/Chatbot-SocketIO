const format = require('date-format');

function createMessages(messageText) {
     return {
        messageText,
        createdAt: format('dd/MM/yyyy - hh:mm:ss', new Date()),
     }
}

module.exports = {createMessages}