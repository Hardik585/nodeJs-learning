const express = require('express');
const mailSender = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = mailSender.createTransport({
  service: 'gmail',
  auth: {
    user: 'hardikkaushik83126@gmail.com',
    pass: process.env.PASSWORD
  }
})

const mailOption = {
  from: "Hardikkaushik83126@gmail.com",
  to: "Hardik100abc@gmail.com",
  subject: 'Sending email using nodeJs',
  text: 'This is learning email sender using nodejs package mailsender',
  attachments:[{
    filename:"dogPhoto.jpg",
    path:'F:/Nodejs/Learn-nodejs/imageUpload/public/images/dog.jpg'
  }]
}

transporter.sendMail(mailOption, (err, info) => {
  if (err) { console.log(err); }
  else {
    console.log(info.response);
  }
})



