/* eslint-env node */
import faker from 'faker';
import User from '../models/User';
import Student from '../models/Student';
import Class from '../models/Class';
import mongoose from 'mongoose';
import Course from '../models/Course';
import Major from '../models/Major';
import Term from '../models/Term';
const jsonfile = require('jsonfile');
const _ = require('lodash');
import path from 'path';
const PATH_JSON_FILE_RESOURCE = path.resolve(__dirname,'./data/crawler.json');
const seedMainClass = async () => {
    const crawler = jsonfile.readFileSync(PATH_JSON_FILE_RESOURCE);
    const classes = _(crawler).unionBy('class').map(e => {
        return new Class({
            _id: e.class,
            name: e.class
        });
    }).value();
    // let classes = [];
    // for (let i=0;i<10;i++) {
    //     let cla = new Class({
    //         name: `Class ${i + 1}`
    //     });
    //     classes.push(cla);
    // }
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
let seedCourse = async (number,majors,terms,lec) => {
    // let courses = [];
    // for (let i=0;i<number;i++){
    //     let lecturer = lec[getRandomInt(0,lec.length)];
    //     let lecturers = [...[],lecturer];
    //     let course = new Course({
    //         name : `INT${getRandomInt(0,2000)}`,
    //         lecturers: lecturers,
    //         major: majors[0]._id,
    //         term: terms._id,
    //     });
    //     courses.push(course);
    // }
    //all course in a term
    const crawler = jsonfile.readFileSync(PATH_JSON_FILE_RESOURCE);
    const courses = _(crawler).unionBy('course').map(e => {
        return new Course({
            _id: _.snakeCase(e.course),
            name: e.courseName,
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
            courses: coursesByMsv[msv],
            class: rows[0].class
        });
    });

    return Promise.all([
        User.create(users),
        Student.create(students)
    ]);
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

        let lecturers =  await seedUser('Lecturer',10);
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
