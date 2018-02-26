import Redis from '../config/redis';
const redisClient = Redis();
import {snakeCaseArray} from '../helper';
import _ from 'lodash';

export default class Course{
    constructor(idCourse,headers,points){
        this.id = idCourse.toString().trim();
        this.headers =snakeCaseArray(headers);
        this.points = points;
    }
    async save(){
        try{
            let data = _(this.points).map(row => {
                return Object.assign({}, ...this.headers.map((n, index) => ({[n]: row[index]})));
            }).value();

            await redisClient.set(this.getKeyCourse(),JSON.stringify(data));

            return this.getKeyCourse();
        } catch (err) {
            throw err;
        }
    }
    getKeyCourse(){
        return _.snakeCase(this.id);
    }
}