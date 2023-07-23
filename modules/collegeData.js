const fs = require("fs");

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
      if (err) {
        reject("Unable to load courses");
        return;
      }

      fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
        if (err) {
          reject("Unable to load students");
          return;
        }

        dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
        resolve();
      });
    });
  });
};

module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length == 0) {
      reject("Query returned 0 results");
      return;
    }

    resolve(dataCollection.students);
  });
};

module.exports.getTAs = function () {
  return new Promise((resolve, reject) => {
    const filteredStudents = dataCollection.students.filter(student => student.TA);

    if (filteredStudents.length == 0) {
      reject("Query returned 0 results");
      return;
    }

    resolve(filteredStudents);
  });
};

module.exports.getCourses = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length == 0) {
      reject("Query returned 0 results");
      return;
    }

    resolve(dataCollection.courses);
  });
};

module.exports.getStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    const foundStudent = dataCollection.students.find(student => student.studentNum == num);

    if (!foundStudent) {
      reject("No results returned");
      return;
    }

    resolve(foundStudent);
  });
};

module.exports.getStudentsByCourse = function (course) {
  return new Promise((resolve, reject) => {
    const filteredStudents = dataCollection.students.filter(student => student.course == course);

    if (filteredStudents.length == 0) {
      reject("No results returned");
      return;
    }

    resolve(filteredStudents);
  });
};


module.exports.updateStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    // Find the index of the student with the matching studentNum
    const index = dataCollection.students.findIndex(
      (student) => student.studentNum === studentData.studentNum
    );

    // If the student with the matching studentNum is found, update the data
    if (index !== -1) {
      // Update the student information
      dataCollection.students[index] = {
        ...dataCollection.students[index],
        ...studentData,
      };
      resolve();
    } else {
      // If no student with the matching studentNum is found, reject with an error message
      reject("Student not found");
    }
  });
};


module.exports.addStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    if (!studentData) {
      reject("Invalid student data");
      return;
    }

    // Set TA property to false if undefined
    studentData.TA = studentData.TA || false;

    // Set studentNum property
    studentData.studentNum = dataCollection.students.length + 261;

    // Push studentData to students array
    dataCollection.students.push(studentData);

    resolve();
  });
};

module.exports.getCourseById = function (id) {
  return new Promise((resolve, reject) => {
    const foundCourse = dataCollection.courses.find(course => course.courseId === id);

    if (!foundCourse) {
      reject("Query returned 0 results");
      return;
    }

    resolve(foundCourse);
  });
};


