import {KIND_ANNOUNCEMENT_NOTIFICATION} from '../constant';
export default (tieuDe, noiDung, id, idmucDoThongBao, idloaiThongBaos, kind, hasfile, idSender, nameSender) => {
    return {
        tieuDe: tieuDe,
        noiDung: noiDung,
        link: id,
        idMucDoThongBao: idmucDoThongBao,
        idLoaiThongBao: idloaiThongBaos,
        kind: kind,
        hasfile: hasfile,
        idSender: idSender,
        nameSender: nameSender,
        typeNotification: KIND_ANNOUNCEMENT_NOTIFICATION
    };

};