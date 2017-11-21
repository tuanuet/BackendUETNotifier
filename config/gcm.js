import gcm from 'node-gcm';
import request from 'request';
const dotenv = require('dotenv');
dotenv.load({ path: '.env.exam' });

export const sendTopic = (data,topic,retrying) => {
    return new Promise((resolve,reject) =>{

        const gcmSender = new gcm.Sender(process.env.SERVER_KEY);
        const message= new gcm.Message({data});

        gcmSender.send(message, { topic }, retrying, (err,response) => {
            if(err) return reject(err);
            return resolve(response);
        });
    });
};
export const sendClass = (data,tokens,retrying) => {
    return new Promise((resolve,reject) =>{
        request({
            url: 'https://gcm-http.googleapis.com/gcm/send',
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `key=${process.env.SERVER_KEY}`
            },
            body: JSON.stringify({
                'data' : data,
                'registration_ids' : tokens
            })
        },function(error,response,body){
            if(error) return reject(error);
            return resolve(body);
        });
    });
};
