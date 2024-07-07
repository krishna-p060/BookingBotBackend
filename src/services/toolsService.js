const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();


const getRoomOptions = async () => {
    
    const rooms = await axios.get('https://bot9assignement.deno.dev/rooms');
    console.log("calling the functions--------get-----------------");
    console.log(rooms.data);
    return rooms.data;
}

const bookRoom = async (roomId, fullName, email, nights) => {
    console.log("calling the functions--------book-----------------");
    const response = await axios.post('https://bot9assignement.deno.dev/book', {
        roomId, fullName, email, nights
    });

    console.log("Booking id---------------------");
    console.log(response.data.bookingId);

    // Send booking confirmation email
    await sendBookingConfirmationEmail(fullName, email, roomId, nights, response.data.bookingId);
    return response.data;
}

const sendBookingConfirmationEmail = async (fullName, email, roomId, nights, bookingId) => {
    
    const userMail = process.env.EMAIL_USER;
    const userPass = process.env.EMAIL_PASS;
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        secure: true,
        port: 465,
        auth: {
            user: userMail,
            pass:  userPass
        }
    });

    // Email content
    let mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email, 
        subject: 'Booking Confirmation - Bot9Palace',
        text: `Dear ${fullName},\n\nYour booking for room ID ${roomId} for ${nights} nights has been confirmed, with booking ID ${bookingId}.\n\nThank you for booking with Bot9Palace.\n\nBest regards,\nBot9Palace`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { getRoomOptions, bookRoom };