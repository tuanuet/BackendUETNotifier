import {KIND_NEW_NOTIFICATION,KIND_ANNOUNCEMENT} from '../constant';
export default ({_id='',title='', content='', imageLink='', link='', author='',tags=[], postAt=''}) => {
    return {
        _id: _id.toString(),
        title: title.toString(),
        content: content.toString(),
        imageLink: imageLink.toString(),
        link: link.toString(),
        author: author.toString(),
        tags: tags.toString(),
        postAt: postAt.toString(),
        kind : KIND_ANNOUNCEMENT.toString(),
        typeNotification: KIND_NEW_NOTIFICATION.toString(),
    };

};