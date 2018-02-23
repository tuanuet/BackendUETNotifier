import {KIND_MARK_ANNOUNCEMENT} from '../constant';

export default (id, tieuDe, noiDung, link, idSender, nameSender) => {
    return {
        id,
        tieuDe: tieuDe,
        noiDung : noiDung,
        link: link,
        idSender: idSender,
        nameSender: nameSender,
        typeNotification: KIND_MARK_ANNOUNCEMENT,
    };
};