# Project Title

School management app

# Demo

https://schoolapp-u33p.onrender.com

- initial load afte 15m of inactivity takes some time (onrender.com specific)
- Sign in as teacher: Email: teacher1@gmail.com Password: 123
- Sign in as student: Email: student3@gmail.com Password: 123

## Main Technologies

React, rtk query, ract full calendar, react-router, react-input emoji, node.js, express.js, socketio, mongodb, cloudinary, jwt, nodemailer

## Main Features

Common features

- View dashboard - upcoming tests, classes, contact us
- Profile - edit profile, view other profiles
- Notification - real time notifications - socketio
- Chat - real time messaging with other users
- Schedule - weekly and monthly schedule
- Classes - preview of classes

Project features: teacher

- Dashboard - class attendance, average class grade, contact admin through contact form
- Classes - add new class
- Class - add new student, asignment, test, attendance, view submitted asignments and grade them

Project features: student

- Class - view asignments, submit asignments, view asignments results
- Attendance - view attendance for specific class
- Grades - view grades and points for specifi class

Project features: admin

- add new student, teacher

## Getting Started

- clone or download zip of depository
- npm install (in both frontend and backend)
- create .env in server folder and add: ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET,NODE_ENV, REFRESH_TOKEN_EXPIRES, ACCESS_TOKEN_EXPIRES, PORT, DATABASE_URI, CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, EMAIL, PASSWORD
- npm run dev (client)
- npm start (server)
