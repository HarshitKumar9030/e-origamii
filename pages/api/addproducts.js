import Product from "../../models/Product";
import ConnectDb from '../../middleware/mongoose';

const handler = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    } else {
        const { name, price, description, productId  } = req.body;
        if (!name && !price && !description && !productId) {
        return res.status(400).json({ error: "Please fill all the fields" });
        } else {
             const product = await Product.findOne({ name });
                if (product) {
                    return res
                    .status(422)
                    .json({
                        status: "error",
                        error: "Product already exists",
                    });
                }
                else{
                    const newProduct = new Product({
                        name: name,
                        price: price,
                        description: description,
                        productId: productId
                    });
                    await newProduct.save();
                    res.status(200).json({
                        status: "success",
                        message: "Product added successfully",
                    });
                }
        }
    }
    }

export default ConnectDb(handler);