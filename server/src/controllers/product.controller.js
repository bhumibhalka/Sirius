import Product from "../DBmodels/product.model";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const addProduct = asyncHandler(async(req,res,next) => {
  const {title,description,category,price} = req.body;
  const {files} = req.body.files;
  const userId = req.user._id;

  // const product = await Product.create({})

  
})