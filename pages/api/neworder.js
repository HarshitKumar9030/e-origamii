import Order from "../../models/Order";
import ConnectDb from '../../middleware/mongoose';
import nodemailer from 'nodemailer';
import Product from "../../models/Product";

const handler = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const transporter = nodemailer.createTransport({
        service: 'mailgun',
        auth: {
            user: process.env.MAILGUN_USER,
            pass: process.env.MAILGUN_SECRET
        }
    });

    try {
        const { name, email, phone, price, date, oid } = req.body;
        const productId = req.body.product;
        const order = await new Order({
            name,
            email,
            phone,
            price,
            date,
            productId: productId,
            uniqueId: oid 
        }).save();

        const product = await Product.findOne({ productId });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const productName = product.name;

        const interactive_invoice = `
            <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="font-size: 24px; color: #333; margin-bottom: 10px;">Invoice</h1>
                    <p style="font-size: 16px; color: #666;">Thank you for your order!</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <h2 style="font-size: 18px; color: #333; margin-bottom: 10px;">Order Details</h2>
                    <p style="font-size: 14px; color: #666; margin-bottom: 5px;"><strong>Product Name:</strong> ${productName}</p>
                    <p style="font-size: 14px; color: #666; margin-bottom: 5px;"><strong>Order ID:</strong> ${order.uniqueId}</p>
                    <p style="font-size: 14px; color: #666; margin-bottom: 5px;"><strong>Order Date:</strong> ${order.date}</p>
                    <p style="font-size: 14px; color: #666; margin-bottom: 5px;"><strong>Order Price:</strong> ₹${order.price} (30% off applied)</p>
                    <p style="font-size: 14px; color: #666; margin-bottom: 5px;"><strong>Product ID:</strong> ${order.productId}</p>
                </div>
                <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="font-size: 14px; color: #666;">Thanks for visiting Silver Jubilee at Ucskm Public School Bhiwadi.</p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: process.env.MAILGUN_USER,
            to: order.email,
            subject: 'Your Order Invoice',
            html: interactive_invoice
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Email sending failed:', err);
                    reject(err);
                } else {
                    console.log('Email sent successfully');
                    resolve(info);
                }
            });
        });

        res.status(200).json({
            status: "success",
            message: "Order created successfully",
        });
    } catch (error) {
        console.error('Order creation failed:', error);
        res.status(500).json({ error: "An error occurred while processing your order" });
    }
};

export default ConnectDb(handler);