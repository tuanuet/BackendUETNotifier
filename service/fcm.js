import gcm from 'node-gcm';
import Student from '../models/Student';


export const sendTopic = (data,topic,retrying=5) => {
    return new Promise((resolve,reject) =>{

        const gcmSender = new gcm.Sender(process.env.SERVER_KEY);
        const message= new gcm.Message({data});

        gcmSender.send(message, { topic }, retrying, (err,response) => {
            if(err) return reject(err);
            return resolve(response);
        });
    });
};

export const sendClass = (data,idClass,retrying = 5) => {
    return new Promise(async (resolve,reject) =>{

        const gcmSender = new gcm.Sender(process.env.SERVER_KEY);
        const message= new gcm.Message({data});

        //TODO: find registrationTokens in db by idClass
        Student.findTokenByIdClass(idClass).then(registrationTokens => {
            gcmSender.send(message, { registrationTokens }, retrying, (err,response) => {
                if(err) return reject(err);
                return resolve(response);
            });
        });



    });
};

export const sendCourse = (data,idCourse,retrying=5) => {
    return new Promise((resolve,reject) =>{

        const gcmSender = new gcm.Sender(process.env.SERVER_KEY);
        const message= new gcm.Message({data});

        //TODO: find registrationTokens in db by idCourse
        Student.findTokenByIdCourse(idCourse).then(registrationTokens => {
            gcmSender.send(message, { registrationTokens }, retrying, (err,response) => {
                if(err) return reject(err);
                return resolve(response);
            });
        });

    });
};

export const sendStudent = (data,code,retrying=5) => {
    return new Promise((resolve,reject) =>{

        const gcmSender = new gcm.Sender(process.env.SERVER_KEY);
        const message= new gcm.Message({data});

        //TODO: find registrationTokens in db by idCourse
        Student.findTokenByCode(code).then(registrationTokens => {
            gcmSender.send(message, { registrationTokens }, retrying, (err,response) => {
                if(err) return reject(err);
                return resolve(response);
            });
        });

    });
};