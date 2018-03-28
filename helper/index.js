import _ from 'lodash';
import {KIND_OF_NEW_LIST} from '../constant';
import * as Constant from '../constant';
import moment from 'moment';

export const changeAlias = (alias) => {
    let str = alias;
    str = str.toLowerCase();
    str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g,'a');
    str = str.replace(/[èéẹẻẽêềếệểễ]/g,'e');
    str = str.replace(/[ìíịỉĩ]/g,'i');
    str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g,'o');
    str = str.replace(/[ùúụủũưừứựửữ]/g,'u');
    str = str.replace(/[ỳýỵỷỹ]/g,'y');
    str = str.replace(/đ/g,'d');
    str = str.replace(/[!@%^*()+=<>?/,.:;'"&#\[]/g,' ');
    str = str.replace(/ + /g,' ');
    str = str.trim();
    return str;
};
const removeChucVi = alias => {
    let str = alias;
    str = str.replace(/TS./g, '');
    str = str.replace(/ThS./g, '');
    str = str.replace(/CN./g, '');
    str = str.replace(/PGS./g, '');
    str = str.replace(/GS./g, '');
    str = str.replace(/GV./g, '');
    str = str.replace(/KS./g, '');
    str = str.replace(/GS.TSKH./g, '');
    str = str.replace(/PGS.TS./g, '');
    str = str.trim();
    return str;
};
export const getTimer = (time) => {
    return moment(time).format('HH:mm:ss MMMM Do YYYY');
};
export const renderPromise = (res,view,body) => {
    return new Promise((resolve,reject) => {
        res.render(view,{data : body},(err,html) => {
            if(err) return reject(err);
            return resolve(html);
        });
    });

};

export const masterSnakeCase = (string) => {
    return _.snakeCase(changeAlias(string));
};

export const snakeCaseArray = (strings) => {
    return _(strings).map(tag => _.snakeCase(changeAlias(tag))).value();
};

export const getNameLecturerArray = (strings) => {
    return _(strings).map(removeChucVi).value();
};

export const getTagsOfNews = (tags) => {
    return _(tags).map(tag => {
        return {
            _id : _.snakeCase(changeAlias(tag)),
            name : tag
        };
    }).value();
};

export const getNameTagBySnake = (snake) => {
    const tags = KIND_OF_NEW_LIST();
    return _(tags).find(tag => tag._id === snake);
};
export function renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
        const newKey = newKeys[key] || key;
        return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
}

export function getTopicNameByCode(code) {
    const _new =_.findLast(KIND_OF_NEW_LIST(), ({_id}) => _id === code);
    if(_new){
        return _new.name;
    }
    return undefined;
}

export const getMomentTime = (date, timeFormat = false) => {
    let timeStr = timeFormat ? moment(date).format('YYYY/MM/DD HH:mm') : moment(date).format('YYYY/MM/DD');

    const current = moment();
    const minuteDiff = current.diff(date, 'minutes');
    const hourDiff = current.diff(date, 'hours');

    if (minuteDiff < 1) {
        timeStr = 'vài giây trước';
    } else if (minuteDiff < 60) {
        timeStr = minuteDiff + ' phút trước';
    } else if (minuteDiff < 24 * 60) {
        timeStr = hourDiff + 'giở trước';
    }

    return timeStr;
};