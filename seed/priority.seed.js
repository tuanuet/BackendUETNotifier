import Priority from '../models/PriorityNotify';

export const seed = async () =>{
    try{
        let emergency = new Priority({code: 'khan_cap',name : 'Khẩn cấp'});
        let warnning = new Priority({code:'canh_bao',name : 'Cảnh báo'});
        let normal = new Priority({code:'binh_thuong',name : 'Bình thường'});
        let priories  = [emergency,warnning,normal];
        await Priority.create(priories);
    }catch(err) {
        console.log(err.message);
    }
};