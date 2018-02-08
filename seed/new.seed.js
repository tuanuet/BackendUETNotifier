import {
    getAllNews
} from '../service';
import New from '../models/New';
/**
 * parse trang chu để lấy dự liệu
 */

export const seed = async () =>  {
    try {
        const news = await getAllNews();
        await New.create(news);
        console.log('Import New Success');
    }catch (err) {
        console.log(err);
    }
};