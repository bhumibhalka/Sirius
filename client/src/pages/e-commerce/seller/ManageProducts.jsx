import { Pencil, Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAddProduct } from '../../../store/slices/popup.slice';
import AddProduct from '../../../components/popups/AddProduct';
import { fetchUserProducts } from '../../../store/slices/product.slice';


const ManageProducts = () => {
 
  const dispatch = useDispatch();
  const {isAddProductModalOpen} = useSelector(state => state.popup);
  const {products} = useSelector(state => state.product)
   console.log(products);

   const [searchQuery, setSearchQuery] = useState('')
   const [filteredCategory, setfilteredCategory] = useState('all')

  const openAddProduct = () => {
    dispatch(toggleAddProduct());
  }

  const filteredProducts = products?.filter((product)=> {
    const matchesSearch = 
    (product.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filteredCategory === 'all' || product.category === filteredCategory;

    return matchesSearch && matchesFilter;
  }) 

  const productStats = [
    {
      title: "TOTAL PRODUCTS",
     number:` ${products.length}`,
      class: "bg-green-100 text-green-500",
      text: "+12%",
       },

    {
      title: "LOW STOCK",
       number: products.length || 12,
       class: "bg-yellow-100 text-yellow-500",
      text: "Warning",
      },
       

    {
      title: "OUT OF STOCK",
       number: products.length || 12,
       class: "bg-red-100 text-red-500",
      text: "Critical",
      },

    {
      title: "MONTHLY SALES",
       number: ` $${products.length}`,
        class: "bg-green-100 text-green-500",
      text: "+12%",
      }

  ]


  return (
    <div className='p-6'>

    {/* HEADER */}
    <div className='flex items-center justify-between '>
      <div>
        <h3 className='text-2xl font-semibold'>Product Inventory</h3>
        <p className='text-sm text-slate-700'>Manage your product catalog and real-time stock availability.</p>
      </div>

      <button
       className='flex items-center bg-black/80 rounded text-white px-2 md:px-4 py-2'
       onClick={openAddProduct}
       >
        <Plus />
        <p className='max-sm:hidden'>Add Product</p>
      </button>
    </div>


    {/* GRID OVERVIEW */}
      <div className='grid gird-cols-1 md:grid-cols-4 gap-5 mt-6 mb-5'>
        { 
        productStats.map((card) => (
          <div
          key={card.title}
          className='black-card relative '
          >
            <h3 className='card-title'>{card?.title}</h3>
            <h3 className='card-value'>{card?.number || 0}</h3>

            <p className={`absolute ${card?.class} top-4 right-4 py-0.5 px-2 rounded-full`}>{card?.text}</p>
          </div>
        ))
        }

      </div>

   {/* FILTERING BUTTON */}
   <div className='flex flex-col md:flex-row gap-2 mb-5'>
    <div>
      <label className='text-lg font-semibold'>Search</label>
    <input
     type="text" 
     className='input'
     value={searchQuery}
     onChange={(e) => setSearchQuery(e.target.value)}
    />
    </div>

    <select 
    className='input'
    value={filteredCategory}
    onChange={(e)=> setfilteredCategory(e.target.value)}
    >
            <option value="all">All</option>
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

    {/* PRODUCTS TABLE */}
<div className="w-full overflow-x-auto">
  <table className="w-full border-collapse text-sm">

    <thead className="bg-black text-white">
      <tr>
        <th className="px-4 py-3 text-left">S.NO</th>
        <th className="px-4 py-3 text-left">Image</th>
        <th className="px-4 py-3 text-left">Title</th>
        <th className="px-4 py-3 text-left">Description</th>
        <th className="px-4 py-3 text-left">Category</th>
        <th className="px-4 py-3 text-left">Stock</th>
        <th className="px-4 py-3 text-left">Price</th>
        <th className="px-4 py-3 text-left">Created</th>
        <th className="px-4 py-3 text-left">Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredProducts && filteredProducts.length > 0 ? (
        filteredProducts.map((product, i) => (
          <tr
            key={product._id}
            className={`border-b hover:bg-gray-50 transition ${i % 2 !== 0 ? "bg-black/80 text-white hover:bg-slate-900" : ""}`}
          >

            {/* S.NO */}
            <td className="px-4 py-3">{i + 1}</td>

            {/* IMAGE */}
            <td className="px-4 py-3">
              <img
                src={product?.media?.[0]?.url}
                alt=""
                className="w-10 h-10 object-cover rounded"
              />
            </td>

            {/* TITLE */}
            <td className="px-4 py-3 font-medium">
              {product?.title}
            </td>

            {/* DESCRIPTION */}
            <td className="px-4 py-3 text-gray-600">
              {product?.description?.slice(0, 40)}...
            </td>

            {/* CATEGORY */}
            <td className="px-4 py-3">
              {product?.category}
            </td>

            {/* STOCK */}
            <td className="px-4 py-3">
              {product?.variants?.[0]?.stock}
            </td>

            {/* PRICE */}
            <td className="px-4 py-3">
              ${product?.variants?.[0]?.price}
            </td>

            {/* DATE */}
            <td className="px-4 py-3">
              {product?.createdAt?.split("T")[0]}
            </td>

            {/* ACTIONS */}
            <td className="px-4 py-3 flex gap-3">
              <button className="text-blue-500 hover:scale-110 transition">
                <Pencil size={18} />
              </button>

              <button className="text-red-500 hover:scale-110 transition">
                <Trash2 size={18} />
              </button>
            </td>

          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9" className="text-center py-6 text-gray-500">
            No product found!!!
          </td>
        </tr>
      )}
    </tbody>

  </table>
</div>


    {/*ADD PRODUCT */}
    {
      isAddProductModalOpen && <AddProduct />
    }
    </div>
  )
}

export default ManageProducts