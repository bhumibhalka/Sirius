import { X } from 'lucide-react'
import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toggleEditModal } from '../../store/slices/popup.slice';
import { editProduct } from '../../store/slices/product.slice';
import { useEffect } from 'react';

const EditModal = ({selectedProduct}) => {

  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.product);

   const [formData, setFormData] = useState({
      title: selectedProduct?.title || '',
      description: selectedProduct?.description || '',
      price: selectedProduct?.variants?.[0]?.price || '',
      stock: selectedProduct?.variants?.[0]?.stock || '',
    })

  const closeModal = () => {
   dispatch(toggleEditModal())
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
     await dispatch(editProduct({id: selectedProduct, data: formData})).unwrap()
      
     closeModal();
     
    } catch (error) {
    console.log(error);
    }
   

  }

  useEffect(()=> {
    if(!selectedProduct) return;
    
    setFormData({
      title: selectedProduct.title || "",
      description: selectedProduct.description || "",
      stock: selectedProduct.variants?.[0]?.stock || "",
      price: selectedProduct.variants?.[0]?.price || "",
    })
   
  },[selectedProduct]);

  return (
    <div className='fixed inset-0 bg-black/50 z-50 backdrop-blur-xs flex items-center justify-center'>

      <div className='bg-white rounded p-4 w-full max-w-md md:max-w-lg drop-shadow-sm space-y-4'>
        
        {/* HEADER */}
        <div className='flex items-center justify-between'>
          <h3 className='card-title'>Edit Product</h3>
          <X className='hover:scale-110 transition-all duration-300 hover:shadow'
          onClick={closeModal}
          />
        </div>

        <hr />

        {/* FORM */}
      <form className='space-y-2' onSubmit={handleSubmit}>

        {/* TITLE */}
        <div>
          <label className='text-sm font-semibold'>Title<sup>*</sup></label>
          <input
           type="text"
           className='input border-slate-300'
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
           />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className='text-sm font-semibold'>Description<sup>*</sup></label>
          <input
           type="text"
           className='input border-slate-300'
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
           />
        </div>

        {/* STOCK */}
        <div>
          <label className='text-sm font-semibold'>Stock<sup>*</sup></label>
          <input
           type="number"
           className='input border-slate-300'
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: e.target.value})}
           />
        </div>

        {/* PRICE */}
        <div>
          <label className='text-sm font-semibold'>Price<sup>*</sup></label>
          <input
           type="number"
           className='input border-slate-300'
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
           />
        </div>

        {/* BTN */}
        <div className='mt-4 flex items-center justify-end gap-2'>
          <button
          type='button'
          className='btn-danger'
          onClick={closeModal}
          >
            Cancel
          </button>

          <button
          type='submit'
          className='btn-black' 
          disabled={loading}  
          >
            {loading ? "Editing...": "Edit"}
          </button>

        </div>


      </form>

      </div>

    </div>
  )
}

export default EditModal