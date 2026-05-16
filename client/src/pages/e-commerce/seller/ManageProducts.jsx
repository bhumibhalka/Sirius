import { Pencil, Plus, Trash2 } from 'lucide-react'
import React, { 
  lazy, 
  Suspense, 
  useCallback, 
  useDeferredValue, 
  useEffect, 
  useMemo, 
  useState
 } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAddProduct, toggleEditModal } from '../../../store/slices/popup.slice';
import { deleteProduct, fetchUserProducts } from '../../../store/slices/product.slice';
import { fetchSellerOrders } from '../../../store/slices/seller.slice';

 const AddProduct = lazy(() => import('../../../components/popups/AddProduct'))
 const EditModal = lazy(()=> import('../../../components/popups/EditModal'))

const CATEGORY_OPTIONS = [
  'all','Limited Edition','Essentials','Accessories',
  'Bags','Men','Women','Shoes','Bespoke','Statement',
]

const ProductRow = React.memo(({product, index, onEdit, onDelete}) =>  {
  return ( <tr
            key={product._id}
            className={`border-b hover:bg-gray-50 transition ${index % 2 !== 0 ? "bg-black/80 text-white hover:bg-slate-900" : ""}`}
          >

            {/* S.NO */}
            <td className="px-4 py-3">{index + 1}</td>

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
              <button
              onClick={()=> onEdit(product._id)}
              className="text-blue-500 hover:scale-110 transition">
                <Pencil size={18} />
              </button>

              <button
              onClick={() => onDelete(product._id)}
              className="text-red-500 hover:scale-110 transition">
                <Trash2 size={18} />
              </button>
            </td>

          </tr>)
})
ProductRow.displayName = 'ProductRow'

const StatCard = React.memo(({card}) => {
  return (
  <div className="black-card relative">
    <h3 className='card-title'>{card.title}</h3>
    <h3 className='card-value'>{card.number}</h3>
    <p className={`absolute ${card.class} top-4 right-4 py-0.5 px-2 rounded-full`}>{card.text}</p>
  </div>)
})
StatCard.displayName = 'StatCard'

const ManageProducts = () => {
 
  const dispatch = useDispatch();

  const isAddProductModalOpen = useSelector(state => state.popup.isAddProductModalOpen)
  const isEditModalOpen = useSelector(state => state.popup.isEditModalOpen)
  const products  = useSelector(state => state.product.products)
  const orders  = useSelector(state => state.seller.orders)
  //  console.log("products:",products);
  //  console.log("orders:",orders);

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCategory, setfilteredCategory] = useState('all')
  const [selectedProduct, setSelectedProduct]= useState(null);

  const deferredSearch = useDeferredValue(searchQuery);

  useEffect(()=> {
   dispatch(fetchSellerOrders({ status: null,  cursor: null}))
  },[dispatch])

  const openAddProduct = useCallback(() => {
    dispatch(toggleAddProduct());
  },[dispatch])

  const openEditModal = useCallback(() => {
    dispatch(toggleEditModal())
  },[dispatch])

  const handleDelete = useCallback((id) => {
    dispatch(deleteProduct(id))
  },[dispatch])
  
  const handleEdit = useCallback((id) => {
    setSelectedProduct(id)
    openEditModal()
  },[openEditModal])


  const totalSales = useMemo(
    () => (orders ?? []).reduce((acc, o) => acc + (o.subtotal ?? 0), 0),
    [orders]
  )

  // const filteredProducts = products?.filter((product)=> {
  //   const matchesSearch = 
  //   (product.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   (product.description || "").toLowerCase().includes(searchQuery.toLowerCase())

  //   const matchesFilter = filteredCategory === 'all' || product.category === filteredCategory;

  //   return matchesSearch && matchesFilter;
  // }) 

  const productStats = useMemo(()=> {
    const safeProducts = products ?? []
    return [
    {
      title: "TOTAL PRODUCTS",
     number: safeProducts.length ?? 0,
      class: "bg-green-100 text-green-500",
      text: "+12%",
       },

    {
      title: "LOW STOCK",
       number: safeProducts.filter((p) => p.variants?.[0]?.stock < 3).length ?? 0,
       class: "bg-yellow-100 text-yellow-500",
      text: "Warning",
      },
       

    {
      title: "OUT OF STOCK",
       number: safeProducts.filter((p) => p.variants?.[0]?.stock === 0).length ?? 0,
       class: "bg-red-100 text-red-500",
      text: "Critical",
      },

    {
      title: "MONTHLY SALES",
       number: `$ ${totalSales ?? 0}`,
        class: "bg-green-100 text-green-500",
      text: "+12%",
      }

  ]
  },[products, totalSales])

  const filteredProducts = useMemo(() => {
    const safeProducts = products ?? [] 
    const lowerSearch = deferredSearch.toLowerCase();

    return safeProducts.filter((product) => {
      const matchesSearch = 
      (product.title || '').toLowerCase().includes(lowerSearch) ||
      (product.description || '').toLowerCase().includes(lowerSearch);

      const matchesFilter = filteredCategory === 'all' || product.category === filteredCategory;

      return matchesFilter && matchesFilter
    })
  }, [products, deferredSearch, filteredCategory])

  useEffect(() => {
    dispatch(fetchSellerOrders({status: null, cursor: null}))
  },[dispatch])


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
        <StatCard 
        key={card.title}
        card={card}
        />
        ))
        }

      </div>

   {/* FILTERING BUTTON */}
   <div className='flex items-center flex-col md:flex-row gap-2 mb-5'>
    <div className='w-full '>
      {/* <label className='text-lg font-semibold'>Search</label> */}
    <input
     type="text" 
     className='input '
     placeholder='Search item by name or description...'
     value={searchQuery}
     onChange={(e) => setSearchQuery(e.target.value)}
    />
    </div>

      <div>
    <select 
    className='input '
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
      {filteredProducts && filteredProducts.length > 0 ? 
      (
        filteredProducts.map((product, index) => (
          
            <ProductRow 
            key={product._id}
            product={product}
            index = {index}
            onEdit={handleEdit}
            onDelete={handleDelete}
            />
  
        ))
      ) 
      
      
      : (
        <tr>
          <td colSpan="9" className="text-center py-6 text-gray-500">
            No product found!!!
          </td>
        </tr>
      )}
    </tbody>

  </table>
</div>


 {/* MODALS – lazy loaded, only mounted when open */} 

    {/*ADD PRODUCT */}
     
    {
      isAddProductModalOpen && (
         <Suspense fallback={null}>
          <AddProduct />
         </Suspense> 
      )
    }

    {/* EDIT PRODUCT */}
    {
      isEditModalOpen && (
        <Suspense fallback={null}>
           <EditModal selectedProduct={selectedProduct} />
        </Suspense>
      )
    }
    </div>
  )
}

export default ManageProducts