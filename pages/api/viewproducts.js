import Product from "../../models/Product";
import ConnectDb from '../../middleware/mongoose';

const handler = async (req, res) => {
    if (req.method === "GET") {
        const products = await Product.find();
        res.status(200).json(products);
    }else{
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default ConnectDb(handler);