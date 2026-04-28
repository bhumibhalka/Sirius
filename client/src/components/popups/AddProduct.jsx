import { X } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAddProduct } from '../../store/slices/popup.slice';
import { useState } from 'react';
import { addProduct } from '../../store/slices/product.slice';

const AddProduct = () => {

  const dispatch = useDispatch();
  const {isAddProductModalOpen} = useSelector(state => state.popup);
  const {loading} = useSelector(state => state.product); 

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
  })

  const [images, setImages] = useState([]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages(files)
  }

  const closeModal = () => {
    dispatch(toggleAddProduct());
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("stock", formData.stock);

    images.forEach((file) => {
      data.append("image", file)
    })

    dispatch(addProduct(data))
    closeModal()
  }

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-xs'>
     
     <div className='bg-white w-full max-w-md p-4 rounded-lg drop-shadow-lg space-y-4 pb-8'>
       
       {/* HEADER */}
       <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold'>Add Product</h3>
        
        <X 
        className='hover:scale-110 transition-all duration-300 hover:shadow rounded'
        onClick={closeModal}
        />
       </div>

       <hr  />

       {/* FORM */}
       <form className='space-y-2'
       onSubmit={handleSubmit}
       >

        <div>
          <label className='text-xs font-semibold' >Product Name<sup>*</sup></label>
          <input 
          type="text"
          className='input border-slate-300'
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value}) }
          required
           />
        </div>

        <div>
          <label className='text-xs font-semibold' >Descritpion<sup>*</sup></label>
          <input 
          type="text"
          className='input border-slate-300'
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value}) }
          required
           />
        </div>

      <div className='flex items-center gap-2'>

        <div>
          <label className='text-xs font-semibold' >Price<sup>*</sup></label>
          <input 
          type="number"
          className='input border-slate-300'
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value}) }
          required
           />
        </div>

        <div>
          <label className='text-xs font-semibold' >Stock<sup>*</sup></label>
          <input 
          type="number"
          className='input border-slate-300'
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: e.target.value}) }
          required
           />
        </div>
        
      </div>


        <div>
          <label className='text-xs font-semibold' >Category<sup>*</sup></label>
          <select
          className='input border-slate-300 text-sm'
          value={formData.category}
          onChange={(e)=> setFormData({...formData, category: e.target.value})}
          required
          >
            <option value="">Selet category</option>
            <option value="Limited Edition">Limited Edition</option>
            <option value="Essentials">Essentials</option>
            <option value="Accessories">Accessories</option>
            <option value="Bags">Bags</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Shoes">Shoes</option>
            <option value="Bespoke">Bespoke</option>
            <option value="Statement">Statement</option>
          </select>
        </div>

        <div className=' border border-dashed w-full flex items-center justify-center h-40 rounded mt-4'  >
          <label htmlFor="images" className=' '>
            Upload Images
            <input 
            id='images'
            type="file"
            accept='image/*'
            multiple
            onChange={handleFiles}
            required
            className='hidden'
             />
          </label>
        </div>
        
        <div className='flex items-center justify-end gap-2 mt-4'>
          <button
          type='button'
          className='btn-danger'
          onClick={closeModal}
          >
            Cancel
          </button>

          <button
          className='btn-black'
          type='submit'
          disabled={loading}
          >
            {loading ? "Adding"  : "Add"}
          </button>
        </div>

       </form>

     </div>

    </div>
  )
}

export default AddProduct