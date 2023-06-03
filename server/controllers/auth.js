const User = require('../models/user');
const {hashPassword, comparePassword} = require('../helpers/auth');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    try {
        // 1.name, email , password destructure
        const {name, email, password} = req.body;

        //2.name, email , password validation
        if (!name.trim()) {
            return res.json({error: 'password must be required'});
        }

        if (!email) {
            return res.json({error: 'Email must be required'});
        }

        if (!password || password < 6) {
            return res.json({error: 'Name must be 06 characters'});
        }
        if (!name.trim()) {
            return res.json({error: 'Name must be required'});
        }

        //3.Email already Taken
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.json({error: 'This Email already registerted'});
        }

        //4.Hash password
        const hashedPassword = await hashPassword(password);

        //5.register user
        const user = await new User(
            {
                name,
                email,
                password: hashedPassword,
            }
        ).save();

        //6.create signed JWT
        const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY, {expiresIn: "7d"});

        //7. Send Response
        res.json(
            {
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role,
            })

    } catch (err) {
        console.log(err);
    }
}