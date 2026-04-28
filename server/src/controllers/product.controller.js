import Product from "../DBmodels/product.model.js";
import cloudinary from "../lib/cloudinary.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";

export const addProduct = asyncHandler(async(req,res,next) => {
   const {title, description, price, stock,category} = req.body;
   const userId = req.user.id;
 
   console.log(req.files.image);

if (
  !req.files ||
  !req.files.image ||
  (Array.isArray(req.files.image) && req.files.image.length === 0)
) {
  return next(new ErrorHandler("Product images are required", 400));
}

   const files = Array.isArray(req.files.image) 
   ? req.files.image 
   : [req.files.image];

   const images = await Promise.all(
    files.map(async(file) => {

       const result = await cloudinary.uploader.upload(file.tempFilePath,{
        folder: "product_images",
      })

      return {
        public_id: result.public_id,
        url: result.secure_url,
      }
    })
   )

   const product = await Product.create({
    sellerId: userId,
    title,
    description, 
    category,
    media: images,
    variants: [
      {
        price:price,
        stock: stock,
      }
    ]
   })

  return res.status(201).json({
    success: true,
    message: "Product added successfully",
    product
   })
})

export const fetchSellerProducts = asyncHandler(async(req,res,next) => {
   const userId = req.user.id;
// console.log("user id",req.user)
// console.log("user id",req.user.id)
   const products = await Product.find({sellerId: userId}).sort({created: -1});

  //  console.log(products);
  return res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    products
  })
})

export const editProduct = asyncHandler(async(req,res,next)=> {
  const {id, title, description, stock, price} = req.body;
  const userId = req.user.id;

  if(!id) {
    return next(new ErrorHandler("Product ID is required",400))
  }

   const updateData = {};

   if(title !== undefined) updateData.title === title; 
   if(description !== undefined) updateData.description === description; 
   if(stock !== undefined) updateData["variants.0.stock"] === stock; 
   if(price !== undefined) updateData["variants.0.price"] === price; 
 

  const product = await Product.findOneAndUpdate({_id: id, sellerId: userId}, {$set: updateData},
    {
      returnDocument: "after", // 👈 modern replacement for { new: true }
      runValidators: true,     // 👈 ensures schema rules apply
    }
  )

  if(!product){
    return next(new ErrorHandler('Product not found or unauthorized ', 404))
  }

  return res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product
  })

})

// export const addProduct = asyncHandler(async(req,res,next) => {
//   const {title,description,category,price,stock} = req.body;
//   const userId = req.user._id;

//   if(!req.files || !req.files.image || req.files.image.length === 0){
//     return next(new ErrorHandler('Product images are required.'))
//   }

//    const files = Array.isArray(req.files.image) 
//    ? req.files.image 
//    : [req.files.image]

  
//   const images = await Promise.all(
//     files.map(async(image) => {
//      const  result =  await cloudinary.uploader.upload(image.tempFilePath, {
//         folder: "product_images"
//        })
//        return {
//         public_url : result.public_id,
//         url :result.secure_url
//        }
//     })
//   )

//   const product = await Product.create({
//     sellerId: userId,
//     title,
//     description,
//     category,
//     media: images,
//     variants: [
//       {
//         price: price,
//         stock: stock,
//       }
//     ],
//   })

//   res.status(201).json({
//     success: true,
//     message: 'Product created successfully',
//     product
//   })
  
// })