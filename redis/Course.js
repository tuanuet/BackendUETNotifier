import Redis from '../config/redis';
const redisClient = Redis();

import _ from 'lodash';

export default class Course{
    constructor(idCourse,headers,points){
        this.id = idCourse.toString().trim();
        this.headers = headers;
        this.points = points;
    }
    async save(){
        let data = _(this.points).map(row => {
            return Object.assign({}, ...this.headers.map((n, index) => ({[n]: row[index]})));
        }).value();
        let status = await redisClient.set(this.getKeyCourse(),JSON.stringify(data));
        return status;
    }
    getKeyCourse(){
        return this.id.replace(' ','_');
    }
}