const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "walko.test@gmail.com",
    pass: "walkotest123",
  },
});

function send(mail) {
  const option = {
    from: "walko.test@gmail.com",
    to: "korovaabc@gmail.com",
    subject: "Send function",
    text: mail,
  };

  transport.sendMail(option, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

module.exports = send;
