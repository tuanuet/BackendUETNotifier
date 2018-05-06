import {
    sendTopic,
    sendToTokens,
    sendCourse,
    sendStudent,
    sendTopicNoContent,
    sendMark,
    sendClassesNoContent,
    sendCoursesNoContent,
    sendToCodesNoContent
} from './firebaseService';
import {
    getAllKindOfNews,
    getAllNews,
    getNewsInpage,
    parseDetailNew
} from './uetCrawler';


export {
    sendTopic,
    sendToTokens,
    sendCourse,
    sendStudent,
    sendClassesNoContent,
    sendCoursesNoContent,
    sendToCodesNoContent,
    getAllNews,
    getAllKindOfNews,
    getNewsInpage,
    parseDetailNew,
    sendMark,
    sendTopicNoContent
};