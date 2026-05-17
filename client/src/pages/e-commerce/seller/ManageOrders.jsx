import { 
  Calendar, 
  CheckCircle, 
  DollarSign, 
  Plus, 
  RefreshCwIcon, 
  Truck, 
  XCircle
 } from 'lucide-react'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSellerOrders } from '../../../store/slices/seller.slice';


 
  const STATUS_STATS = [
    {
      title: "Pending",
      icon: Calendar ,
      status: 'pending'
    },
    {
      title: "Processing",
      icon: RefreshCwIcon,
      status: 'processing'
    },
    {
      title: "Shipped",
      icon: Truck,
      status: 'shipped'
    },
    {
      title: "Delivered",
      icon: CheckCircle,
      status: 'shipped'
    },
    {
      title: "Cancelled",
      icon: XCircle,
      status: 'cancelled'
    },
    {
      title: "Paid",
      icon: DollarSign,
      status: 'paid'
    },
  ]

  const StatCard = React.memo(({title, icon:Icon, value}) => {
    return (
        <div className='black-card max-sm:flex  max-sm:items-center max-sm:justify-between' >
        <div className='flex items-center gap-2'>
          
         <Icon />
         <h4 className='font-semibold'>{title}</h4>
        </div>
        <div className='font-bold text-xl'>
          {value ?? 0} 
        </div>
      </div>
    )
  })
  StatCard.displayName = 'StatCard'

  const OrderRow = React.memo(({ order }) => {
    return (
       <tr className='black-card border border-b ' >
        <td className='px-4 py-2'>#{order._id.slice(0,10)}..</td>
        <td className='px-4 py-2'>{order.createdAt.split("T")[0]}</td>
         <td className='px-4 py-2'>{order.customerName}</td>
         <td className='px-4 py-2'>${order.subtotal}</td>
         <td className='px-4 py-2'>{order.status}</td>
         <td className='px-4 py-2'>
          <button>Details</button>
         </td>
       </tr>      
    )
  })
  OrderRow.displayName = 'OrderRow';


const ManageOrders = () => {
  const dispatch = useDispatch();

  // Granular selector – avoids re-render when unrelated seller slice keys change
  const orders = useSelector(state => state.seller.orders) ;

  useEffect(()=> { 
    dispatch(fetchSellerOrders({ status: null, cursor: null}))
    // console.log('seller orders running');
  },[dispatch]);

  // Single pass over orders to build all 6 counts at once
  // instead of 6 separate .filter() calls on every render
  const statCounts = useMemo(()=>{
    const counts = {}
    STATUS_STATS.forEach(s => { counts[s.status] = 0})
    if(Array.isArray(orders)) {
      orders.forEach(order => {
        if(counts[order.status] !== undefined)
          counts[order.status]++
      })
    }
    return counts
  },[orders])

  const safeOrders = orders ?? []

  console.log(orders);

  return (
    <div className='p-4 space-y-6'>

    {/* HEADERS */}
      <div className='flex items-center max-sm:flex-col gap-2 '>
      {/* heading */}
        <div className='w-full'>
        <h3 className='text-2xl font-semibold'>Order Tracking</h3>
        <p className='text-sm'>Manage and monitor fulfillment status across all active channels</p>
        </div>

        {/* create orders */}
        <div className='flex items-center max-sm:flex-col max-sm:w-full gap-2'>
          <button 
          className='btn-outline'
          >
            Export CSV
          </button>
          <button className='btn-black flex items-center justify-center w-full  '>
            <Plus />
            <p className='text-sm '>Create New Order</p>
          </button>
        </div>

      </div>

      {/* STATS */}
       <div className='grid gird-cols-1 md:grid-cols-6 gap-4'>
    
        
          {
            STATUS_STATS.map((stat) => (
  <StatCard key={stat.title} title={stat.title} value={statCounts[stat.status]} icon={stat.icon} />
))
          }
       

       </div>

       {/* PRODUCTS */}
       <div className='overflow-x-auto w-full'>
        <table className='w-full'>
          <thead className='black-card '>
            <tr >
              <th className='px-4 py-2 text-left'>ORDER ID</th>
              <th className='px-4 py-2 text-left'>DATE</th>
              <th className='px-4 py-2 text-left'>CUSTOMER</th>
              <th className='px-4 py-2 text-left'>AMOUNT</th>
              <th className='px-4 py-2 text-left'>STATUS</th>
              <th className='px-4 py-2 text-left'>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {
              safeOrders?.length > 0 
              ? (
                safeOrders.map((order) => (
                  <OrderRow key={order._id} order={order} />
                ))
              ) 
              : (
                <div>No orders yet!!!</div>
              )
            }
          </tbody>
        </table>
       </div>

       {/*  */}

    </div>
  )
}

export default ManageOrders;