/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Daniel Carvajal Student ID: 117888222 Date: July 20
*
*  Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/ 


const path = require('path');
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const exphbs = require('express-handlebars'); 
const bodyParser = require("body-parser");
const collegeData = require("./modules/collegeData");

// Create an instance of exphbs
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
        '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
});

// Register handlebars as the rendering engine for views
app.engine('.hbs', hbs.engine); // Use hbs.engine here
app.set('view engine', '.hbs');

// Add the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing url-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
  next();
});



// Routes
app.get("/students", (req, res) => {
  let course = req.query.course;
  if (course) {
      collegeData.getStudentsByCourse(course)
          .then(students => {
              if (students.length > 0) {
                  res.render("students", { students: students });
              } else {
                  res.render("students", { message: "no results" });
              }
          })
          .catch(err => {
              res.render("students", { message: err });
          });
  } else {
      collegeData.getAllStudents()
          .then(students => {
              if (students.length > 0) {
                  res.render("students", { students: students });
              } else {
                  res.render("students", { message: "no results" });
              }
          })
          .catch(err => {
              res.render("students", { message: err });
          });
  }
});


app.get("/tas", (req, res) => {
  collegeData.getTAs()
    .then(tas => {
      if (tas.length > 0) {
        res.json(tas);
      } else {
        res.json({ message: "no results" });
      }
    })
    .catch(err => {
      res.json({ message: err });
    });
});

app.get("/courses", (req, res) => {
  collegeData.getCourses()
    .then(courses => {
      if (courses.length > 0) {
        res.render("courses", { courses: courses });
      } else {
        res.render("courses", { message: "no results" });
      }
    })
    .catch(err => {
      res.render("courses", { message: "no results" });
    });
 });
 

 app.get("/course/:id", (req, res) => {
  const courseId = parseInt(req.params.id);

  collegeData
    .getCourseById(courseId)
    .then((course) => {
      res.render("course", { course: course });
    })
    .catch((err) => {
      res.render("course", { message: err });
    });
});

app.get("/student/:studentNum", (req, res) => {
  let num = req.params.studentNum;
  collegeData
    .getStudentByNum(num)
    .then(student => {
      res.render("student", { student: student });
    })
    .catch(err => {
      res.render("student", { message: err });
    });
});

app.post("/student/update", (req, res) => {
  collegeData
    .updateStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.send("Error updating student: " + err);
    });
});


// ...

app.get("/", (req, res) => {
  res.render("home");
});


// GET /about
app.get("/about", (req, res) => {
  res.render("about");
});


// GET /htmlDemo
app.get('/htmlDemo', (req, res) => {
  // Render the htmlDemo view
  res.render('htmlDemo');
});


// GET /students/add
app.get("/students/add", (req, res) => {
  res.render("addStudent"); // Render the addStudent.hbs view
});


// POST /students/add
app.post("/students/add", (req, res) => {
  collegeData.addStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch(err => {
      res.json({ message: err });
    });
});

// 404 route
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Initialize collegeData and start the server
collegeData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch(err => {
    console.log(err);
  });



