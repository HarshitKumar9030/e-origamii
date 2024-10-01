import User from "../../models/User";
import ConnectDb from "../../middleware/mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  // Validate email and password fields
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).json({
        status: "error",
        error: "User does not exist with that email",
      });
    }

    // Compare hashed password with the input password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(422).json({
        status: "error",
        error: "Password is incorrect",
      });
    }

    // Create JWT token valid for 7 days
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { name, email: userEmail, role, _id } = user;

    // Return success response with token and user information
    res.status(200).json({
      status: "success",
      token: token,
      user: {
        id: _id,
        name: name,
        email: userEmail,
        role: role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default ConnectDb(handler);
