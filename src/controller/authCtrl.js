const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../model/userModel');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // O'z email manzilingiz
    pass: "sbyt ueey rlwj kfgm", // Email parolingiz yoki App password
  },
});


const authCtrl = {
  sendMail: async (req, res) => {
    const { email } = req.body;
    // Email tekshirish
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const verificationCode =  Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const output = `
      <div
          style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              border: 1px solid #ddd;
              border-radius: 5px;
              overflow: hidden;
          "
          >
          <div style="background-color: #f2f2f2; padding: 20px; text-align: center">
              <img
              src="https://static.vecteezy.com/system/resources/thumbnails/023/778/652/small_2x/ai-generated-ai-generative-realistic-illustration-of-different-skin-body-care-products-beauty-healthy-luxury-lifestyle-graphic-art-photo.jpg"
              alt="Logo"
              style="width: 300px; height: 200px; object-fit: cover"
              />
          </div>
          <div
              style="
              background-color: #ebecf0;
              color: #babecc;
              padding: 15px 20px;
              text-align: center;
              "
          >
              <h2 style="margin: 0; font-size: 24px">
              Код подтверждения для аккаунта
              </h2>
          </div>
          <div style="padding: 20px; color: #333">
              <p>Уважаемый пользователь!</p>
              <p>
              Мы получили запрос на доступ к вашему аккаунту
              <strong>${email}</strong>. Ваш код подтверждения:
              </p>

Node Modules, [16.04.2025 7:44]


              <div style="text-align: center; margin: 10px 0">
              <h2 style="font-size: 30px; color: red">${verificationCode}</h2>
              </div>
              <p>Ваш адрес ${email}. Вы получили это письмо для подтверждения входа.</p>
              <p>Если вы не ввели этот адрес, значит кто-то пытается зарегистрироваться с помощью этой учетной записи. Пожалуйста, будьте осторожны</p>
          </div>
          <div
              style="
              background-color: #f2f2f2;
              padding: 15px;
              text-align: center;
              color: #777;
              "
          >
              <p style="margin: 0">С уважением,</p>
              <p style="margin: 5px 0">Команда Beauty Brand</p>
          </div>
      </div>
  `;
      
      // Email ma'lumotlari
      const mailOptions = {
        from: '"Logistika" <aba06096@gmail.com>',
        to: email, // Kimga yuboriladi
        subject: 'Test Email',            // Xat mavzusi
        text: 'Salom! Bu nodemailer orqali yuborilgan test xabari.', // Xat matni
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
    const { fullname, email, phoneNumber, password } = req.body;
    console.log("Received data:", req.body);
  
    // Basic validation
    if (!password || (!email && !phoneNumber) || !fullname) {
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
        fullname,
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