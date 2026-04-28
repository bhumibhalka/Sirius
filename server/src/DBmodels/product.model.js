import mongoose from 'mongoose'
import crypto from "crypto";

const productSchema = new mongoose.Schema({
  sellerId:{
    type:String,
    required: true,
    index: true,
  },
  title: {
    type:String,
    required: true,
    minlength: [3, 'Product title should be at least 3 characters'],
    maxlength: [1000, 'Product title cannot contain more than 1000 characters',],
    index: 'text',
    trim: true,
  },
  description: {
    type:String,
    required: true,
    minlength: [3, 'Product title should contain at least 3 characters'],
    maxlength: [2000, 'Product description cannot contain over 1000 characters'],
  },
  slug: {
    type:String,
    unique: true,
    lowercase: true,
  },
  category:{
    type:String,
    required: true,
    // type: mongoose.Schema.Types.ObjectId,
    // ref:'Category',
    // required: true,
    // index: true,
  },
  media: [{
    type:{ type: String, enum: ['image', 'video'], default: 'image'},
    public_id: {type: String, required: true},
    url: {type: String, required: true},
    isPrimary: {type: Boolean, default: false}
  }],
  variants: [{
    sku: {type: String , unique: true, sparse: true},
    attributes: {
      color: String,
      size: String,
      material: String,
    },
    price: {type:Number, required: true, min:0},
    discountPrice: {type:Number, default: 0},
    stock: {type: Number, default: 0, min: 0},
  }]
  ,shipping: {
    weight: Number,
    dimensions : {
      length: Number,
      width: Number,
      height: Number,
    },
    isDigital: {type:Boolean, default: false},
  },
  // Advanced AI Features: Vector Embeddings
  // This allows "Visual Search" (upload a photo to find this product)
  vectorEmbedding: {
    type: [Number], // Array of 512 or 1024 floats from a Vision Model
    select: false   // Do not return by default to save bandwidth
  },
  //Socia; Prood & Trust Metrics
  metrics: {
    averageRating: {type: Number, default: 0},
    reviewCount: {type:Number, default: 0},
    totalSold: {type:Number, default: 0}
  },
  status: {
    type:String,
    enum: ['draft', 'active', 'out_of_stock', 'archived'],
    default: 'draft',
  },
},{timestamps: true,
  toJSON: {virtuals: true},
})

productSchema.index({title: 'text'})
productSchema.index({description: 'text'})
productSchema.index({createdAt: -1})

// productSchema.pre('save', function () {
//   if (this.isModified('title')) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/[^\w ]+/g, '')
//       .replace(/ +/g, '-');
//   }
// });




productSchema.pre("save", async function () {  // ✅ No `next` parameter
  // SLUG
  if (this.isModified("title")) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");

    let slug = baseSlug;
    let count = 1;

    while (await mongoose.models.Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }

  // SKU
  this.variants.forEach((variant) => {
    if (!variant.sku) {
      variant.sku = `SKU-${crypto.randomBytes(4).toString("hex")}`;
    }
  });

  // ✅ No next() call needed — async hooks resolve via the returned promise
});



const Product = mongoose.model("Product", productSchema);
export default Product