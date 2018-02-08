import {KIND_NEW_NOTIFICATION,KIND_ANNOUNCEMENT} from '../constant';
export default ({_id,title, content, imageLink, link, author,tags, postAt}) => {
    return {
        _id,
        title,
        content,
        imageLink,
        link,
        author,
        tags,
        postAt,
        kind : KIND_ANNOUNCEMENT,
        typeNotification: KIND_NEW_NOTIFICATION,
    };

};