import {KIND_FEEDBACK_NOTIFICATION} from '../constant';
import _ from 'lodash';

export default ({_id,updatedAt,announcementId,createdAt,kindSender,content,sender,subFeedback}) => {
    return {
        _id: _id.toString(),
        updatedAt: updatedAt.toString(),
        createdAt: createdAt.toString(),
        announcementId: announcementId.toString(),
        content: content.toString(),
        subFeedback: _.isNull(subFeedback) ? 'null' : subFeedback.toString(),
        kindSender: kindSender.toString(),
        sender: JSON.stringify(sender),
        typeNotification: KIND_FEEDBACK_NOTIFICATION.toString(),
    };
};