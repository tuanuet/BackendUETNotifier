import Priority from '../models/PriorityNotify';

export const seed = async () =>{
    try{
        let emergency = new Priority({name : 'Khẩn cấp'});
        let warnning = new Priority({name : 'Cảnh báo'});
        let normal = new Priority({name : 'Bình thường'})
        let priories  = [emergency,warnning,normal];
        await Priority.create(priories);
    }catch(err) {
        console.log(err.message)
    }
};