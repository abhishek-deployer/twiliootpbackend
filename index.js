// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const accountSid = 'AC9c93ce3086c48b98b0260618e9f4a0b1';
const authToken = '5597ffe0444f918e61b65afcd8bc3a3f';
const client = new twilio(accountSid, authToken);

let generatedOTP = ''; // Store the generated OTP on the server

app.post('/send-otp', (req, res) => {
  const { to } = req.body;

  generatedOTP = generateOTP();
  console.log("otp",generateOTP)

  client.messages
    .create({
      body: `Your OTP is: ${generatedOTP}`,
      from: +12028001664,
      to: to,
    })
    .then(() => {
      res.json({ success: true, message: 'OTP sent successfully' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    });
});

app.post('/verify-otp', (req, res) => {
  const { otp } = req.body;

  if (otp=== generatedOTP) {
    res.json({ success: true, message: 'OTP verification successful' });
  } else {
    res.json({ success: false, message: 'Incorrect OTP' });
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
