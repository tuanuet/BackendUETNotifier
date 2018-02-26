/* eslint-env node */
import faker from 'faker';
import User from '../models/User';
import Student from '../models/Student';
import Class from '../models/Class';
import mongoose from 'mongoose';
import Course from '../models/Course';
import Lecturer from '../models/Leturer';
import Major from '../models/Major';
import Term from '../models/Term';
const jsonfile = require('jsonfile');
const _ = require('lodash');
const helper = require('../helper');
import path from 'path';
const PATH_JSON_FILE_RESOURCE = path.resolve(__dirname,'./data/crawler.json');
const PATH_JSON_LECTURER_FILE_RESOURCE = path.resolve(__dirname,'./data/lecturer.json');
const seedMainClass = async () => {
    const crawler = jsonfile.readFileSync(PATH_JSON_FILE_RESOURCE);
    const classes = _(crawler).unionBy('class').map(e => {
        return new Class({
            _id: e.class,
            name: e.class
        });
    }).value();

    return Class.create(classes);
};

const createUser = (role,length) => {
    let users = [];
    for(let i=0;i<length;i++){
        let user = new User({
            email : `${role[0]}${i}@gmail.com` ,
            password : '1',
            role
        });
        users.push(user);
    }
    return users;
};

const seedUser = async (model,length) => {
    const users = createUser(model,length);
    const Model = mongoose.model(model);
    let arr = await User.create(users);
    let results = arr.map((user) => {
        return new Model({
            _id:user._id,
            name: faker.name.lastName()
        });
    });
    return Model.create(results);
};

function getRandomInt(min = 0, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
/**
 * seed lop mon hoc
 * @param number
 * @param majors
 * @param terms
 * @param lecturers
 * @returns {Promise<courses>}
 */
let seedCourse = async (number,majors,terms,lecturers) => {
    //all course in a term
    const crawler = jsonfile.readFileSync(PATH_JSON_FILE_RESOURCE);
    const lecturerCrawler = jsonfile.readFileSync(PATH_JSON_LECTURER_FILE_RESOURCE);

    const groupByCourseId = _(lecturerCrawler)
        .groupBy('courseId')
        .value();

    const getLecturerByCourseId = courseId => {
        let lecturerNames = _.map(groupByCourseId[courseId], item => item.lecturerName);

        return lecturers.filter(lecturer => {
            return _.some(lecturerNames,name => name === lecturer.name);
        }).map(lecturer => lecturer._id);
    };
    const courses = _(crawler).unionBy('course').map(e => {
        return new Course({
            _id: _.snakeCase(e.course),
            name: e.courseName,
            lecturers: getLecturerByCourseId(e.course),

            major: majors[0]._id,
            term: terms._id,
        });
    }).unionBy('_id').value();

    return Course.create(courses);
};
/**
 * Seed khoa
 * @returns {Promise.<majors>}
 */
let seedMajor = async () => {
    let majors = [];
    let cntt = new Major({
        name : 'Khoa Công nghệ thông tin'
    });
    let dtvt = new Major({
        name : 'Khoa Điện tử viễn thông'
    });
    let ttm = new Major({
        name : 'Truyển thông và mạng máy tính'
    });
    majors = [...majors,cntt,dtvt,ttm];

    return Major.create(majors);

};
/**
 * seed kif hoc
 * @returns {Promise.<*>}
 */
let seedTerm = async () => {
    return new Term({
        name: 'Học kì II năm học 2017-2018'
    }).save();
};

async function seedStudent() {
    const crawler = jsonfile.readFileSync(PATH_JSON_FILE_RESOURCE);
    const groupByStudent = _(crawler)
        .groupBy('msv')
        .value();
    // code student => courses
    const coursesByMsv = _.reduce(groupByStudent, (result, rows, msv) => {
        const courses = _(rows).map(row => row.course).value();
        result[msv] = courses;
        return result;
    }, {});
    //create user
    const users = _(groupByStudent)
        .map((rows, msv) => {
            return new User({
                email : `${msv}@vnu.edu.vn` ,
                password : msv,
                role: 'Student'
            });
        }).value();

    const userIdByCode = _(users).reduce((result,user) => {
        const msv = user.email.split('@')[0];
        result[msv] = user._id;
        return result;
    },{});
    //create student with id User
    const students = _.map(groupByStudent, (rows, msv) => {
        return new Student({
            _id: userIdByCode[msv],
            code: msv,
            name: rows[0].name,
            courses: helper.snakeCaseArray(coursesByMsv[msv]),
            class: rows[0].class
        });
    });

    return Promise.all([
        User.create(users),
        Student.create(students)
    ]);
}

async function seedLecturer() {

    const lecturerCrawler = jsonfile.readFileSync(path.resolve(__dirname,'./data/lecturer.json'));
    const groupByLecture = _(lecturerCrawler).groupBy('lecturerName').value();
    const lecturers = _(groupByLecture).map((items, name) => name.split(';')[0]).union().value();

    const nameLecturers = helper.getNameLecturerArray(lecturers);
    const snakeCaseEmails = helper.snakeCaseArray(nameLecturers);

    const users = _(snakeCaseEmails).map(email => {
        return new User({
            email : `${email}@vnu.edu.vn` ,
            password : '1',
            role: 'Lecturer'
        });
    }).value();

    const lecs = _(users).map((user,pos) => {
        return new Lecturer({
            _id: user._id,
            name: lecturers[pos]
        });
    }).value();

    const dataSave = await Promise.all([
        User.create(users),
        Lecturer.create(lecs)
    ]);

    return dataSave[1];
}
const seed = async () => {
    try {
        let admins = await seedUser('Admin',10);
        console.log('seed success admin');

        let departments = await seedUser('Department',10);
        console.log('seed success department');

        let faculties = await seedUser('Faculty',10);
        console.log('seed success faculty');

        let classes = await seedMainClass();
        console.log('seed success class');

        //seed lectuer ========================================================
        let lecturers = await seedLecturer();
        console.log('seed success lecturer');


        let majors = await seedMajor();
        console.log('seed success major');

        let terms = await seedTerm();
        console.log('seed success term');

        let courses = await seedCourse(4,majors,terms,lecturers);
        console.log('seed success course');

        let students = await seedStudent();
        console.log('seed success student');

    } catch (err) {
        console.log(err);
    }

};

export default seed();
