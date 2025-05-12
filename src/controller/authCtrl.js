const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../model/userModel');
const { default: axios } = require('axios');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // O'z email manzilingiz
    pass: "sbyt ueey rlwj kfgm", // Email parolingiz yoki App password
  },
});


const authCtrl = {
  // API to get makes by year
  getYear: async (req, res) => {
    const { year } = req.params;
  
    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }
  
    try {
      const response = await axios.get(
        `https://www.carqueryapi.com/api/0.3/?cmd=getMakes&year=${year}`,
        { responseType: "text" } // muhim
      );
  
      const clean = JSON.parse(
        response.data.replace("var carquery = ", "").replace(/;$/, "")
      );
  
      res.status(200).json(clean.Makes || []);
    } catch (error) {
      console.error("Error fetching makes by year:", error.message);
      res.status(500).json({ error: "Failed to fetch makes by year" });
    }
  },  
  getMakes: async (req, res) => {
    const { make, year } = req.params;
  
    if (!make || !year) {
      return res.status(400).json({ error: 'Make and year are required' });
    }
  
    try {
      const response = await axios.get(
        `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${make}&year=${year}`,
        { responseType: "text" } // JSONP ni to'g'ri o'qish uchun
      );
  
      // JSONP formatni tozalash
      const clean = JSON.parse(
        response.data.replace("var carquery = ", "").replace(/;$/, "")
      );
  
      res.status(200).json(clean.Models || []);
    } catch (error) {
      console.error('Error fetching models:', error.message);
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  },
  sendMail: async (req, res) => {
    const {
  email,
  phone,
  fromLocation,
  fromLocationDetails,
  toLocation,
  toLocationDetails,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  transportType,
  isOperable,
  firstAvailableDate
} = req.body;
    // Email tekshirish
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    try {
      const {
        senderEmail,
  email,
  phone,
  fromLocation,
  fromLocationDetails,
  toLocation,
  toLocationDetails,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  transportType,
  isOperable,
  firstAvailableDate
} = req.body;

const output = `
  <div
    style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      background-color: #fff;
    "
  >
    <div
      style="
        background-color: #004080;
        color: #fff;
        padding: 20px;
        text-align: center;
      "
    >
      <h2 style="margin: 0; font-size: 22px">
        Vehicle Transport Request
      </h2>
    </div>
    <div style="padding: 20px; color: #333">
      <ul style="list-style: none; padding: 0; margin: 0">
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>Email:</strong> ${email}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>Phone:</strong> ${phone}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>From (ZIP):</strong> ${fromLocation}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>From (Full):</strong> ${fromLocationDetails}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>To (ZIP):</strong> ${toLocation}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>To (Full):</strong> ${toLocationDetails}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>Vehicle Make:</strong> ${vehicleMake}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>Vehicle Model:</strong> ${vehicleModel}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>Vehicle Year:</strong> ${vehicleYear}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>Transport Type:</strong> ${transportType}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>Operable:</strong> ${isOperable}</li>
        <li style="margin-bottom: 10px;"><span style="color: #004080;">●</span> <strong>First Available Date:</strong> ${firstAvailableDate}</li>
      </ul>
    </div>
    <div
      style="
        background-color: #f2f2f2;
        padding: 15px;
        text-align: center;
        color: #777;
        font-size: 14px;
      "
    >
      <p style="margin: 0">Regards,</p>
      <p style="margin: 5px 0"><strong>AVOX Transport Team</strong></p>
    </div>
  </div>
`;


      
      // Email ma'lumotlari
      const mailOptions = {
        from: '"AVOX" <aba06096@gmail.com>',
        to: senderEmail, // Kimga yuboriladi
        subject: 'Quote',
        text: 'Please check this quote', 
        html: output// Agar HTML formatda yuborilsa
      };
      // Emailni jo'natish
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.status(403).json({ message: 'sent failed' });
        } else {
          res.status(200).json({ message: 'sent successfully' });
        }
      });
    } catch (error) {
      console.error('Email yuborishda xatolik yuz berdi:', error);
      return false;
    }
  },
  signup: async (req, res) => {
    const {email, phoneNumber, password } = req.body;
    console.log("Received data:", req.body);
  
    // Basic validation
    if (!password || (!email && !phoneNumber)) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Check for existing user
      const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  
      if (existingUser) {
        return res.status(400).json({ message: "Email or phone number already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save new user
      const user = new User({
        email,
        phoneNumber,
        password: hashedPassword,
      });
      await user.save();
  
      // Generate JWT token
      const token = JWT.sign(
        { id: user._id, email: user.email },
        JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );
  
      res.status(201).json({
        message: "Регистрация прошла успешно",
        user: { _id: user._id, email, phoneNumber },
        token,
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  login: async (req, res) => {
    const { email, phoneNumber, password } = req.body;
    console.log(req.body);
    
    // Basic validation
    if (!password || (!email && !phoneNumber)) {
      return res.status(400).json({ message: 'Email/Phone and password are required' });
    }

    try {
      // Check if user exists
      const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Логин или пароль неверны' });
      }

      // Generate JWT token
      const token = JWT.sign(
        { id: user._id, email: user.email },
        JWT_SECRET_KEY,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: 'Авторизация прошла успешно',
        user: {_id: user._id, email: user.email, phoneNumber: user.phoneNumber },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  },

  googleAuth: async (req, res) => {
    const { email } = req.body;
  
    try {
      // 1. Loglash (debug uchun)
      console.log("Google Auth Request Body:", req.body);
  
      // 2. Foydalanuvchini qidirish
      const findUser = await User.findOne({ email });
  
      if (findUser) {
        // Agar foydalanuvchi mavjud bo'lsa, token yaratish
        const token = JWT.sign(
          { email: findUser.email, _id: findUser._id, role: findUser.role },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "24h" }
        );
  
        return res.status(200).json({
          message: "Авторизация прошла успешно",
          user: findUser,
          token,
        });
      } 
  
      // 3. Yangi foydalanuvchi yaratish
      const newUser = await User.create(req.body);
  
      // Token yaratish (faqat kerakli ma'lumotlar)
      const token = JWT.sign(
        { email: newUser.email, _id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );
  
      return res.status(201).json({
        message: "Регистрация прошла успешно",
        user: newUser,
        token,
      });
  
    } catch (error) {
      // 4. Xatolikni qaytarish
      console.error("Google Auth Error:", error);
      return res.status(503).json({ message: "Серверная ошибка. Попробуйте позже." });
    }
  },
  forgotPassword: async (req, res) => {
    const { email, phoneNumber } = req.body;

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    try {
      if (email) {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const mailOptions = {
          from: `Beauty Brand <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Password Reset Code',
          html: `<p>Your password reset code is: <strong>${verificationCode}</strong></p>`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset code sent successfully', verificationCode });
      } else if (phoneNumber) {
        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // await client.messages.create({
        //   to: phoneNumber,
        //   from: process.env.TWILIO_PHONE_NUMBER,
        //   body: `Your password reset code is: ${verificationCode}`,
        // });

        res.status(200).json({ message: 'Password reset code sent successfully', verificationCode });
      } else {
        res.status(400).json({ message: 'Email or phone number is required' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send password reset code' });
    }
  },
};

module.exports = authCtrl;