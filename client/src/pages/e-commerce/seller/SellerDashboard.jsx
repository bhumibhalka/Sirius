import { ArrowBigRight, ArrowBigRightIcon, Badge, Check, CheckCircle, CheckCircle2, DollarSign, ShoppingBag } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


const SellerDashboard = () => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);

  const notificationColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-300 text-green-700 border border-green-300 shadow "
        break;
    
      case "medium":
        return "bg-yellow-300 text-yellow-700 border border-yellow-300 shadow "
        break;
    
      case "high":
        return "bg-red-300 text-red-700 border border-red-300 shadow "
        break;
    
      default:
        return "bg-gray-300 text-gray-700 border border-gray-300 shadow "
        break;
    }
  }

  const priorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-200 text-green-500 borde border-green-200 "
        break;

      case "medium" :
        return "bg-yellow-200 text-yellow-500 "
       break;

      case "high" :
        return "bg-red-200 text-red-500 "
        break;

      default:
        return "text-gray-500"
        break;
    }
  }


  return (
    <div className='bg-black/80  mt-14 p-8 min-h-screen space-y-6 md:space-y-10 '>

     {/* HEADER */}
     <div className='text-white mb-4 space-y-1 '>
      <h2 className='font-semibold text-3xl md:text-5xl uppercase'>{`${user?.username}`|| "Dashboard"}</h2>
      <p className='text-sm'>Welcome back. Here is what's happening with your store toady.</p>
     </div>


      {/* top */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>

        {/* TOTAL SELLS */}
        <div className='card '>
            <div className='card-header'>
              <div className='card-icon'>
              <DollarSign className='font-bold text-white ' />
              </div>
              <h3 className='card-title'>TOTAL SALES</h3>
            </div>

            <div className='mt-4'>
              <p className='card-value' >$50,000.00</p>
            </div>

            <div
            className=''
            >
             {/* {user.totalsells(money) monthgy compare up or down using reduce function } */}

              <p></p>
            </div>
        </div>

        {/* TOTAL PRODUCTS */}
        <div className='card '>
            <div className='card-header'>
              <div className='card-icon'>
              <Badge  className='font-bold text-white ' />
              </div>
              <h3 className='card-title'>TOTAL PRODUCTS</h3>
            </div>

              <p className='card-value' >124</p>

            <div
            className=''
            >
             {/* {user.totalsells(money) monthgy compare up or down using reduce function } */}

              <p></p>
            </div>
        </div>

        {/* TOTAL ORDERS */}
        <div className='card '>
            <div className='card-header'>
              <div className='card-icon'>
              <ShoppingBag className='font-bold text-white ' />
              </div>
              <h3 className='card-title'>TOTAL ORDERS</h3>
            </div>

              <p className='card-value' >1999</p>


            <div
            className=''
            >
             {/* {user.totalsells(money) monthgy compare up or down using reduce function } */}

              <p></p>
            </div>
        </div>

      </div>



      {/* between */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 md:h-[60vh]'>
     
       <div className='card md:col-span-2'></div>

      {/* RECENT ACTIVITY */}
       <div className='card'>
        {/* header */}
         <div className='mb-6'>
          <h3 className='text-xl font-bold'>Recent Acitivty</h3>
          <p className='text-sm' >Latest platform transcation</p>
         </div>

         <div className='relative'>
          {/* {notifications.map} */}
            <div className='flex gap-3 border-b pb-4 border-slate-400'>

              {/* icon */}
              <div className={`${notificationColor("low")} inline-block p-2 rounded-lg`}>
                <CheckCircle2 />
                </div>

              <div>
                <h4 className='font-semibold'>Order</h4>
                <p className='text-xs'>3mins ago</p>
              </div>

              <div className={`absolute top-1 right-1  py-0.5 px-2 rounded-full ${priorityColor("low")}`}>
                <p className='text-xs'>completed</p>
              </div>


            </div>

            <div className='mt-4'>
              <button className='w-full text-center font-semibold hover:scale-105 transition-all duration-300'>View All Acitiviy</button>
            </div>
         </div>

       </div>

      </div>



      {/* bottom */}
      <div>
        {/* header */}
        <div className=' flex  items-center justify-between mb-4 text-white'>
          <div>
          <h3 className='font-semibold text-lg '>Top Performing Products</h3>
          <p className='text-sm text-slate-300'>Based on revenue</p>
          </div>

        {/* VIEW ALL BTN */}
        <div className='flex items-center max-sm:text-sm max-sm:flex-col'>
         <button
          // onClick={() => Navigate("/seller/manage-products")}
          className='hover:scale-105 transition-all duration-300'
          >View All Products</button>
          <ArrowBigRight />
          </div>
        </div>


        {/* products */}
        <div className='flex overflow-y-scroll items-center gap-5'>
          {/* map on top selling products  only -4 on them on ui*/}
          <div className='overflow-hidden rounded-lg '>
            {/* img div */}
            <div className=''>
              <img src="/bag.jpeg" alt=""  className='h-[60%] overflow-hidden'/>
            </div>

            <div className='bg-white text-black border-t border-slate-300 pt-2 px-2'>
              <h3>Bag</h3>
            <div className='flex items-center justify-between'>
              <div>
              <p>Revenue</p>
              <h3>$16000.00</h3>
              </div>
                  
              <div>
                  <p>Growth</p>
                  <p>+18%</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default SellerDashboard