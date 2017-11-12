/* eslint-env node */
import faker from 'faker';
import User from '../models/User';
import Student from '../models/Student';
import Class from '../models/Class';
import Faculty from '../models/Faculty';
import Lecturer from  '../models/Leturer';
import Department from '../models/Department';
import mongoose from 'mongoose';
import Course from '../models/Course';
import Major from '../models/Major';
import Term from '../models/Term';

const seedMainClass = async () => {
    let classes = [];
    for (let i=0;i<10;i++) {
        let cla = new Class({
            name: `Class ${i + 1}`
        });
        classes.push(cla);
    }
    return Class.create(classes);
};


const createUser = (role,length) => {
    let users = [];
    for(let i=0;i<length;i++){
        let user = new User({
            email : faker.internet.email(),
            password : '1234',
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
 * @returns {Promise.<void>}
 */
let seedCourse = async (number,majors,terms,lec) => {
    let courses = [];
    for (let i=0;i<number;i++){
        let lecturer = lec[getRandomInt(0,lec.length)];
        let lecturers = [...[],lecturer];
        let course = new Course({
            name : `INT${getRandomInt(0,2000)}`,
            lecturers: lecturers,
            major: majors[0]._id,
            term: terms._id,
        });
        courses.push(course);
    }
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
        name: 'Học kì I năm học 2016-2017'
    }).save();
};

async function seedStudent(classes, courses, number) {
    let users = createUser('Student',number);
    let userStudents = await User.create(users);
    let students = userStudents.map((user) => {
        return new Student({
            _id:user._id,
            name: faker.name.lastName(),
            class : classes[getRandomInt(0,classes.length)].id,
            courses : [courses[getRandomInt(0,courses.length)].id]
        });
    });
    return Student.create(students);
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

        let students = await seedStudent(classes,courses,10);
        console.log('seed success student');

    } catch (err) {
        console.log(err);
    }

};

export default seed();
