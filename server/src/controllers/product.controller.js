import Cart from "../DBmodels/cart.model.js";
import Product from "../DBmodels/product.model.js";
import cloudinary from "../lib/cloudinary.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import User from "../models/user.js";

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
   const products = await Product.find({sellerId: userId}).sort({createdaAt: -1});

  //  console.log(products);
  return res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    products
  })
})

export const editProduct= asyncHandler(async(req,res,next) => {
    const {id, title, description, stock , price} = req.body;
    const userId = req.user.id;

    console.log(title, description, stock , price);

    if(!id) {
      return next(new ErrorHandler('Product ID us required',400))
    }
    

    const product = await Product.findOne({_id: id, sellerId: userId})
    
        if(!product){
          return next(new ErrorHandler('Product not found',404))
        }


        
    if(title ) product.title = title;
    if(description) product.description = description;
    if(stock ) product["variants.0.stock"] = stock;
    if(price) product["variants.0.price"] = price;
    
    await product.save()
    
    return res.status(200).json({
      success: true,
      message: 'Product edited successfully',
      product,
    })
})

export const deleteProduct = asyncHandler(async(req,res,next) => {
  const {id} = req.params;
  const userId = req.user.id;

  const product = await Product.findOne({_id :id, sellerId: userId});

  if(!product){
    return next(new ErrorHandler('Product not found',404))
  }

  // const files = Array.isArray(product.media.image) ? product.media. = we already do this when uplaoding

  await Promise.all(
    product.media.map(async(image) => {
      await cloudinary.uploader.destroy(image.public_id)
    })
  )

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    id
  })
})

export const getProducts = asyncHandler(async(req,res,next) => {

  const products = await Product.find().sort({createdAt: 1}).lean()
  //user can only read product data not modify it or chnage it interact with it

  res.status(200).json({
    success: true,
    products
  })

})

export const getProduct = asyncHandler(async(req,res,next)=> {
  const {id} = req.params;

  const product = await Product.findById(id);
  if(!product){
    return next(new ErrorHandler('Product not found.',404))
  }

  res.status(200).json({
    success: true,
    product,
  })

})

// export const editProduct = asyncHandler(async(req,res,next)=> {
//   const {id, title, description, stock, price} = req.body;
//   const userId = req.user.id;

//   if(!id) {
//     return next(new ErrorHandler("Product ID is required",400))
//   }

//    const updateData = {};

//    if(title !== undefined) updateData.title === title; 
//    if(description !== undefined) updateData.description === description; 
//    if(stock !== undefined) updateData["variants.0.stock"] === stock; 
//    if(price !== undefined) updateData["variants.0.price"] === price; 
 

//   const product = await Product.findOneAndUpdate({_id: id, sellerId: userId}, {$set: updateData},
//     {
//       returnDocument: "after", // 👈 modern replacement for { new: true }
//       runValidators: true,     // 👈 ensures schema rules apply
//     }
//   )

//   if(!product){
//     return next(new ErrorHandler('Product not found or unauthorized ', 404))
//   }

//   return res.status(200).json({
//     success: true,
//     message: 'Product updated successfully',
//     product
//   })

// })

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