const request = require('request');
const _ = require('lodash');

const getSomeCondition = (topics) => {
    return _.map(topics,topic => {
        return `'${topic}' in topics`;
    }).join(' || ');
};
const getEveryCondition = (topics) => {
    return _.map(topics,topic => {
        return `'${topic}' in topics`;
    }).join(' && ');
};

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

const optionSomeConditions = (topics,data) => {
    return {
        uri: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {'Authorization': `key=${process.env.SERVER_KEY}`},
        json: {
            // note that Sequelize returns token object array, we map it with token value only
            'condition': getSomeCondition(topics),
            // iOS requires priority to be set as 'high' for message to be received in background
            'priority': 'high',
            'data': data,
            're_trying' : 2
        }
    };
};

const optionEveryConditions = (topics,data) => {
    return {
        uri: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {'Authorization': `key=${process.env.SERVER_KEY}`},
        json: {
            // note that Sequelize returns token object array, we map it with token value only
            'condition': getEveryCondition(topics),
            // iOS requires priority to be set as 'high' for message to be received in background
            'priority': 'high',
            'data': data,
            're_trying' : 2
        }
    };
};
export const toSomeTopicList = (topics,data) =>  {
    return new Promise((resolve,reject) => {
        request(optionSomeConditions(topics,data), function(error, response, body) {
            if(error) reject(error);
            if(response.statusCode === 200){
                return resolve(body);
            }
            return reject('Some thing wen\'t wrong');

        });
    });
};

export const toEveryTopicList = (topics,data) =>  {
    return new Promise((resolve,reject) => {
        request(optionEveryConditions(topics,data), function(error, response, body) {
            if(error) reject(error);
            if(response.statusCode === 200){
                return resolve(body);
            }
            return reject('Some thing wen\'t wrong');

        });
    });
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
