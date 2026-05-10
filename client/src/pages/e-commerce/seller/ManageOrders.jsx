import { Calendar, CheckCircle, DollarSign, DollarSignIcon, Plus, RefreshCwIcon, Truck, XCircle } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSellerOrders } from '../../../store/slices/seller.slice';

const ManageOrders = () => {
  const dispatch = useDispatch();

  const orders = useSelector(state => state.seller?.orders) || {};

  const stats = [
    {
      title: "Pending",
      icon: Calendar ,
      value : orders?.filter(order => order.status === "pending").length
    },
    {
      title: "Processing",
      icon: RefreshCwIcon,
      value : orders?.filter(order => order.status === "processing").length
    },
    {
      title: "Shipped",
      icon: Truck,
      value : orders?.filter(order => order.status === "shipped").length
    },
    {
      title: "Delivered",
      icon: CheckCircle,
      value : orders?.filter(order => order.status === "delivered").length
    },
    {
      title: "Cancelled",
      icon: XCircle,
      value : orders?.filter(order => order.status === "cancelled").length
    },
    {
      title: "Paid",
      icon: DollarSign,
      value : orders?.filter(order => order.status === "paid").length
    },
  ]

  useEffect(()=> { 
    dispatch(fetchSellerOrders({ status: null, cursor: null}))
  },[dispatch]);

  console.log(orders);

  return (
    <div className='p-4 space-y-6'>

    {/* header */}
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

      {/* stats */}
       <div className='grid gird-cols-1 md:grid-cols-6 gap-4'>
    
        
          {
            stats.map((stat) =>{
              const Icon = stat.icon;
              return (
              <div
              key={stat.title}
              className='black-card max-sm:flex max-sm:items-center max-sm:justify-between'
              >
                <div className='flex items-center gap-2'>
                {/* icon */}
                <div>
                  <Icon />
                </div>

                {/* title */}
                <div>
                  <h4 className='font-semibold'>{stat.title}</h4>
                </div>
                </div>
                <div className='font-bold text-xl'>
                  {stat.value}
                </div>

              </div>
            )})
          }
       

       </div>

       {/* products */}
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
              orders && orders.length > 0 
              ? (
                orders.map((order) => (
                  <tr
                  key={order.id}
                  className='black-card border border-b '
                  >
                    <td className='px-4 py-2'>#{order._id.slice(0,10)}..</td>
                    <td className='px-4 py-2'>{order.createdAt.split("T")[0]}</td>
                    <td className='px-4 py-2'>{order.customerName}</td>
                    <td className='px-4 py-2'>${order.subtotal}</td>
                    <td className='px-4 py-2'>{order.status}</td>
                    <td className='px-4 py-2'>
                      <button>
                        Details
                      </button>
                    </td>

                  </tr>
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