import KindOfAnnoucement from '../models/KindOfAnnouncement';

export const seed = async () =>{
    try{
        let a1 = new KindOfAnnoucement({_id: 'nghi_hoc',name : 'Nghỉ Học'});
        let a2  = new KindOfAnnoucement({_id: 'lich_thi',name : 'Lịch thi'});
        let a3 = new KindOfAnnoucement({_id: 'dang_ki',name : 'Đăng ký'});
        let a4 = new KindOfAnnoucement({_id: 'canh_bao_hoc_vu',name : 'Cảnh báo học vụ'});
        let a5 = new KindOfAnnoucement({_id: 'hoc_bong',name : 'Học bổng'});
        let array  = [a1,a2,a3,a4,a5];
        await KindOfAnnoucement.create(array);
    }catch(err) {
        console.log(err.message);
    }
};