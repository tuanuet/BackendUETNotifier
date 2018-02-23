import _ from 'lodash';
import {KIND_OF_NEW_LIST} from '../constant';
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

export const snakeCaseArray = (strings) => {
    return _(strings).map(tag => _.snakeCase(changeAlias(tag))).value();
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