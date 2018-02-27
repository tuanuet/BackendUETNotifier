import Course from '../models/Course';
import Lecturer from '../models/Leturer';

export const getDashboard = async (req,res) => {
    res.redirect('/');
};

export const getManageCourses = async (req,res) => {
    res.render('lecturer/manage-courses');
};
export const getCourseByIdLecturer = async (req,res) => {
    const courses = await Course.getCoursesByIdLecturer(req.user._id);
    res.json(courses);
};

export const getDatatableManageCourses = async (req,res) => {
    Course.dataTable(req.query,function (err,data) {
        res.json(data);
    });
};
export const postRegisterCourse = async (req,res) => {
    const {idCourse,isAdd} = req.body;
    const data = await Course.updateLecturerById(idCourse,req.user._id,isAdd);
    res.json(data);
};
