import Order from "../../models/Order";
import ConnectDb from "../../middleware/mongoose";
import nodemailer from "nodemailer";

const handler = async (req, res) => {
  // Setting up nodemailer transporter (optional for email notification)
  const transporter = nodemailer.createTransport({
    service: "mailgun",
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_SECRET,
    },
  });

  if (req.method === "POST") {
    const { orderId, status } = req.body;

    try {
      // Find the order by its uniqueId and update its status
      const order = await Order.findOneAndUpdate(
        { uniqueId: orderId },
        { status: status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Send email notification if needed (optional)
      const mailOptions = {
        from: process.env.MAILGUN_USER,
        to: order.email,
        subject: `Your Order Status has been updated to ${status}`,
        html: `<p>Your order with ID <strong>${order.uniqueId}</strong> is now <strong>${status}</strong>.</p>`,
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log("Error sending email:", err);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      return res.status(200).json({ success: true, message: "Order status updated successfully", order });
    } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ success: false, message: "Failed to update order status" });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
};

export default ConnectDb(handler);
