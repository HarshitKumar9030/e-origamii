import User from "../../models/User";
import ConnectDb from '../../middleware/mongoose';
import CryptoJS from "crypto-js";
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    } else {
        const { email, password } = req.body;
        if (!email && !password) {
        return res.status(400).json({ error: "Please fill all the fields" });
        } else {
        const user = await User.findOne({ email });
        if (!user) {
            return res
            .status(422)
            .json({
                status: "error",
                error: "User does not exist with that email",
            });
        } else {
            const bytes = CryptoJS.AES.decrypt(user.password, process.env.LOCK);
            const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
            if (originalPassword !== password) {
            return res
                .status(422)
                .json({
                status: "error",
                error: "Password is incorrect",
                });
            } else {
            const token = jwt.sign({ userId: user._id }, process.env.LOCK, {
                expiresIn: "7d",
            });
            const { name, email, role, _id } = user;
            res.status(200).json({
                status: "success",
                token: token,
                user: { id: _id },
            });
            }
        }
        }
    }
    }

export default ConnectDb(handler);