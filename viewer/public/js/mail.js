var nodemailer = require('nodemailer');

// Create a SMTP transport object
var transport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: "pieter.93.pva@gmail.com",
        pass: ""
    }
});

console.log('SMTP Configured');

// Message object
var message = {

    // sender info
    from: 'Sender Name <pieter.93.pva@gmail.com>',

    // Comma separated list of recipients
    to: '"Receiver Name" <pieter.93.pva@gmail.com>',

    // Subject of the message
    subject: 'Nodemailer is unicode friendly ?',

    // plaintext body
    text:'hello to myself',

    // HTML body
    html:'<p><b>Hello</b> to myself <img src="cid:note@node"/></p>'+
    '<p>Here\'s a nyan cat for you as an embedded attachment:<br/></p>'
};

console.log('Sending Mail');
transport.sendMail(message, function(error){
    if(error){
        console.log('Error occured');
        console.log(error.message);
        return;
    }
    console.log('Message sent successfully!');}
