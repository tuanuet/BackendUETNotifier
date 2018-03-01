import {
    sendTopic,
    sendToTokens,
    sendCourse,
    sendStudent,
    sendMark
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
    getAllNews,
    getAllKindOfNews,
    getNewsInpage,
    parseDetailNew,
    sendMark
};