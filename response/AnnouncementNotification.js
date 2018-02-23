import {KIND_ANNOUNCEMENT} from '../constant';
export default (tieuDe, noiDung, id, idmucDoThongBao, idloaiThongBao, hasfile, idSender, nameSender, priorityCode) => {
    return {
        tieuDe: tieuDe,
        noiDung: noiDung,
        link: id,
        idMucDoThongBao: idmucDoThongBao,
        idLoaiThongBao: idloaiThongBao,
        hasfile: hasfile,
        idSender: idSender,
        nameSender: nameSender,
        typeNotification: KIND_ANNOUNCEMENT,
        codeMucDoThongBao : priorityCode
    };
};