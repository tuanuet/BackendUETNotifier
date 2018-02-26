import Redis from '../config/redis';
const redisClient = Redis();
import {snakeCaseArray} from '../helper';
import _ from 'lodash';
const {promisify} = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);

export default class Mark {
    constructor(msv,name,middleMark,finalMark) {
        this.student = {
            code: msv,
            name: name
        };
        this.markMiddle = middleMark;
        this.markFinal = finalMark;
    }

    static getMarkByKeyCourse(idCourse){
        return getAsync(idCourse).then(JSON.parse)
            .then(points => {
                if(points) {
                    return Promise.resolve(
                        _(points).map(item => {
                            return new Mark(item.ma_sv,item.ho_ten,item.thanh_phan,item.cuoi_ky);
                        }).value());
                }
                return Promise.resolve([]);
            });
    }

}
