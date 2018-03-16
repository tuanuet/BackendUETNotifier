import _ from 'lodash';
import * as helper from '../helper';
export const KINDOFRECEIVER = ['All', 'Course', 'Class', 'Student'];
export const RECEIVER = {ALL : 0, COURSE : 1, CLASS : 2, STUDENT : 3};
export const REACTION = {
    0: 'angry',
    1: 'cry',
    2: 'love',
    3: 'wow',
    4: 'surprise',
};
export const KIND_NEW_NOTIFICATION = 2;
export const KIND_ANNOUNCEMENT = 1;
export const KIND_MARK_ANNOUNCEMENT = 3;

export const NEW_LIMIT = 20;

export const KIND_OF_NEW_LIST = () => {
    const KIND_OF_NEW_LIST =  [ 'Tin Sinh Viên',
        'Tin Nghiên Cứu',
        'Tin Tổng Hợp',
        'Học phí, học bổng',
        'Đào tạo sau Đại học',
        'Thạc sỹ',
        'Tiến sỹ',
        'Cơ hội việc làm',
        'Cựu sinh viên',
        'Quy chế, qui định',
        'Sản phẩm Khoa học công nghệ',
        'Tin Đào Tạo',
        'Tin tức' ];
    return _(KIND_OF_NEW_LIST).map(item => {
        return {
            _id: helper.masterSnakeCase(item),
            name: item
        };
    }).value();
};

