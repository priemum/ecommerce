var nodemailer = require('nodemailer');
// email sender function
exports.sendEmail = function(req, res, email_posted, title, html){
// Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'lauti.walther@gmail.com',
            pass: 'Locolauti01'
        }
    });
// Definimos el email
var mailOptions = {
    from: `"Criscione Y Asociados" <${transporter.options.auth.user}>`,
    to: email_posted,
    subject: title,
    html: '<h6>No responder a esta dirección.</h6><br>'+html // html body
};
// Enviamos el email
transporter.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
    } else {
        console.log("Email sent to " + mailOptions.to);
    }
});
};