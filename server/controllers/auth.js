import User from '../models/user.js';
import OTP from '../models/otp.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


import sendEmail from '../utils/email.js';
import generateSignupEmail from '../templates/signup.js';


export async function otpHandler(req, res) {

    try {

        const { email } = req.params;

        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }


        const otp = Math.floor(1000 + Math.random() * 9000);

        const newOTP = new OTP({

            email: email,
            otp: otp
        });

        newOTP.save();


        return res.status(200).json({
            success: true,
            message: `An OTP has been sent to ${email}.`
        });


    } catch (e) {

        console.log("Error in sending OTP : ", e);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error."
        });

    }
}



export async function signupHandler(req, res) {

    try {

        const { firstname, lastname, email, password, confirmPassword, otp } = req.body;

        console.log(firstname, lastname, email, password, confirmPassword, otp);

        if (!firstname || !lastname || !email || !password || !confirmPassword || !otp) {

            return res.status(400).json({

                success: false,
                message: 'Please provide all the details.',
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({

                success: false,
                message: 'User already exists.',
            });
        }

        if (password !== confirmPassword) {

            return res.status(400).json({

                success: false,
                message: 'Passwords do not match.',
            });
        }

        const userid = firstname + (Math.floor(1000 + Math.random() * 9000));

        const payload = { firstname, lastname, email };

        const token = jwt.sign(payload, process.env.JWT_SECRET);

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            userid,
            token,
        });

        await newUser.save();

        const body = generateSignupEmail(firstname, userid, password);

        await sendEmail(email, 'Account Created', body);

        return res.status(201).json({

            success: true,
            message: 'User created successfully.',
        });

    } catch (error) {

        console.error('Error in signup', error);

        return res.status(500).json({

            success: false,
            message: 'Server error',
        });
    }
}



export async function loginHandler(req, res) {

    try {

        const { userid, password } = req.body;

        if (!userid || !password) {

            return res.status(400).json({

                success: false,
                message: "Fields can't be empty"
            });
        }
        // Checking the user is already registered or not
        let existingUser = await User.findOne({ userid });

        if (!existingUser) {

            return res.status(400).json({

                success: false,
                message: "Invalid credentials!"
            });
        }

        // Validate the user id and password using bcrypt compareSync method
        const validPassword = bcrypt.compare(password, existingUser.password);

        if (!validPassword) {

            return res.status(401).json({

                success: false,
                message: "Invalid Password"
            });
        }


        return res.status(200).json({

            success: true,
            message: 'User logged in successfully',
            token: existingUser.token
        });


    } catch (e) {

        console.log('Error: ', e);

        return res.status(500).json({

            success: false,
            message: 'Server Error!'
        });
    }
}
