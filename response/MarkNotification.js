import {KIND_MARK_ANNOUNCEMENT} from '../constant';

export default (id='', tieuDe='', noiDung='', link='', idSender='', nameSender='') => {
    return {
        _id: id.toString(),
        tieuDe: tieuDe.toString(),
        noiDung : noiDung.toString(),
        link: link.toString(),
        idSender: idSender.toString(),
        nameSender: nameSender.toString(),
        typeNotification: KIND_MARK_ANNOUNCEMENT.toString(),
    };
};