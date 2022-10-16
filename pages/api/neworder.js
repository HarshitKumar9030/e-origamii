import Order from "../../models/Order";
import ConnectDb from '../../middleware/mongoose';
import nodemailer from 'nodemailer';
import Product from "../../models/Product";

const handler = async (req, res) => {
    //Setting nodemailer
    const transporter = nodemailer.createTransport({
        service: 'mailgun',
        auth: {
            user: process.env.MAILGUN_USER,
            pass: process.env.MAILGUN_SECRET
        }
    });
    if (req.method === "POST") {
        const { name, email, phone, price, date, productId, uniqueId } = req.body;
        // use the Order model to create a new order
        const order = await new Order({
            name: name,
            email: email,
            phone: phone,
            price: price,
            date: date,
            productId: productId,
            uniqueId: uniqueId
        }).save();

        // Find Product name by id
        const product = await Product.findOne({ productId });
        const productName = product.name;

        // Create the invoice
        const interactive_invoice = `
        <div style="width: 100%; height: 100%; background-color: #f5f5f5; padding: 20px 0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px;">
        <div style="width: 100%; text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 1.5rem; color: #333;">Invoice</h1>
        </div>
        <div style="width: 100%; text-align: left; margin-bottom: 20px;">
            <h2 style="font-size: 1.2rem; color: #333;">Product Id: ${order.productId}</h2>
        </div>
              <div style="width: 100%; text-align: left; margin-bottom: 20px;">
            <h2 style="font-size: 1.2rem; color: #333;">Product Name: ${productName}</h2>
        </div>
        <div style="width: 100%; text-align: left; margin-bottom: 20px;">
            <h2 style="font-size: 1.2rem; color: #333;">Order Unique Id: ${order.uniqueId}</h2>
        </div>
        <div style="width: 100%; text-align: left; margin-bottom: 20px;">
            <h2 style="font-size: 1.2rem; color: #333;">Order Date: ${order.date}</h2>
        </div>
        <div style="width: 100%; text-align: left; margin-bottom: 20px;">
            <h2 style="font-size: 1.2rem; color: #333;">Order Price:₹ ${order.price} at 30% off.</h2>
        </div>
        <div style="width: 100%; text-align: left; margin-bottom: 20px;">
            <h2 style="font-size: 1.2rem; color: #333;">Order Product Id: ${order.productId}</h2>
        </div>
        <div style="font-size: 1rem;font-weight: semibold;color: #333;margin-top: 8px; text-align: center;" class="footer">Thanks for visiting Silver Jubilee at Ucskm Public School Bhiwadi.</div>
    </div>
</div>
        `;

        // Send the invoice
        const mailOptions = {
            from: process.env.MAILGUN_USER,
            to: order.email,
            subject: 'Invoice for the order',
            html: interactive_invoice
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('sent');
            }
        });
        res.status(200).json({
            "status": "success",
            "message": "Order created successfully",
        });
    }else{
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default ConnectDb(handler);