import User from "../../models/User";
import ConnectDb from "../../middleware/mongoose";
import CryptoJS from "crypto-js";


const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  } else {
    const { email, password, name } = req.body;
    if (!email && !password && !name) {
      return res.status(400).json({ error: "Please fill all the fields" });
    } else {
      const user = await User.findOne({ email });
      if (user) {
        return res
          .status(422)
          .json({
            status: "error",
            error: "User already exists with that email",
          });
      } else {
        const passEncoded = CryptoJS.AES.encrypt(
          password,
          process.env.LOCK
        ).toString();
        const newUser = new User({
          name: name,
          email: email,
          password: passEncoded,
        });
        await newUser.save();
        res
          .status(201)
          .json({ status: "success", message: "User created successfully" });
      }
    }
  }
};

export default ConnectDb(handler);
