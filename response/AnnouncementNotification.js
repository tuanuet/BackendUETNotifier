import {KIND_ANNOUNCEMENT} from '../constant';
export default (tieuDe='', noiDung='', id='', idmucDoThongBao='', idloaiThongBao='', hasfile='', idSender='', nameSender='', priorityCode='', description='') => {
    return {
        tieuDe: tieuDe,
        noiDung: noiDung,
        link: id.toString(),
        idMucDoThongBao: idmucDoThongBao.toString(),
        idLoaiThongBao: idloaiThongBao.toString(),
        hasfile: hasfile.toString(),
        idSender: idSender.toString(),
        nameSender: nameSender,
        typeNotification: KIND_ANNOUNCEMENT.toString(),
        description,
        codeMucDoThongBao : priorityCode
    };
};