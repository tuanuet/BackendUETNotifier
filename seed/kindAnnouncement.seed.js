import KindOfAnnoucement from '../models/KindOfAnnouncement';

export const seed = async () =>{
    try{
        let a1 = new KindOfAnnoucement({name : 'Nghỉ Học'});
        let a2  = new KindOfAnnoucement({name : 'Lịch thi'});
        let a3 = new KindOfAnnoucement({name : 'Đăng ký'});
        let a4 = new KindOfAnnoucement({name : 'Cảnh báo học vụ'});
        let a5 = new KindOfAnnoucement({name : 'Học bổng'});
        let array  = [a1,a2,a3,a4,a5];
        await KindOfAnnoucement.create(array);
    }catch(err) {
        console.log(err.message)
    }
};