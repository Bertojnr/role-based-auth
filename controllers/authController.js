const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const checkIfUserExists = await User.findOne({ email: email })
        // console.log(checkIfUserExists);
        if (checkIfUserExists) {
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists. Please try using a different email okay"
            })
        }

        //hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const registeredUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            role: role || "user"
        })

        await registeredUser.save();

        if (registeredUser) {
            return res.status(200).json({
                success: true,
                message: "You have successfully registered"
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Registeration failed"
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json({
                sucess: false,
                message: "Inalid credentials"
            })
        }

        const accessToken = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }

        )

        res.status(200).json({
            sucess: true,
            message: "Logged in Successful",
            accessToken
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Some error occured, please try again"
        })
    }
}


const changePassword = async (req, res) => {
    try{
        const userId = req.userInfo.userId;
        const { oldPassword, newPassword } = req.body

        const user = await User.findById(userId)
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Password do not match"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword ,salt)

        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch(error) {
        console.log(error)
        res.status(500).json({
            success : false,
            message: "Internal Server error"
        })
    }
}


module.exports = { registerUser, loginUser, changePassword };