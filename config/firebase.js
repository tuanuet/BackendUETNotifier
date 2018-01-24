const request = require('request');
const options = (topic,data) => {
    return {
        uri: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {'Authorization': `key=${process.env.SERVER_KEY}`},
        json: {
            // note that Sequelize returns token object array, we map it with token value only
            'to': `/topics/${topic}`,
            // iOS requires priority to be set as 'high' for message to be received in background
            'priority': 'high',
            'data': data,
            're_trying' : 2
        }
    };
};
export const toTopic = (topic,data) => {
    return new Promise((resolve,reject) => {
        request(options(topic,data), function(error, response, body) {
            if(error) reject(error);
            if(response.statusCode === 200){
                return resolve(body);
            }
            return reject('Some thing wen\'t wrong');

        });
    });
};
