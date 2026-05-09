import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { fetchadminStats } from '../../store/slices/admin.slice';
import {AlertCircle, AlertOctagon, BoxIcon, DollarSign, Loader, Users} from "lucide-react"
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  
  

  
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {metrics, loading} = useSelector(state => state.admin);

    //       revenue: revenueStats[0]?.totalRevenue || 0,
    //     orders: revenueStats[0]?.orderCount || 0,
    //     avgValue: revenueStats[0]?.avgOrderValue || 0,
    //     users :totalUsers,
    //   },
    //   distribution: statusDistribution,
    //   inventory: lowStockCount
    // }

  const stats = [
    {
      title: "Total Users",
      value: metrics?.users,
      icon: Users,
    },
    {
      title: "Total Orders",
      value: metrics?.orders,
      icon: BoxIcon,
    },
    {
      title: "Total Sales",
      value:`$ ${ metrics?.revenue}`,
      icon: DollarSign,
    },
    {
      title: "Low Stock Count",
      value: metrics?.inventory ?? 0,
      icon: AlertOctagon,
    },


  ]

  useEffect(()=>{
    dispatch(fetchadminStats({cursor: null}))
  },[])

  if(loading || !metrics) {return <div className='flex items-center justify-center h-screen '> <Loader className='animate-spin' /> </div> 
  }
  return (
    <div className='p-4 space-y-6'>

      {/* navbar */}
      <div className='bg-black h-16 text-white p-2'>
        <ul className='flex gap-4 '>
          <li className='font-semibold hover:scale-105 transition-all duration-300 hover:underline'> <Link to={'/admin/user-management'}> Manage Users</Link></li>
          <li className='font-semibold hover:scale-105 transition-all duration-300 hover:underline'><Link to={'/admin/order-management'}> Manage Orders</Link></li>
          <li className='font-semibold hover:scale-105 transition-all duration-300 hover:underline'><Link to={'/admin/product-management'}> Manage Products</Link></li>
          <li className='font-semibold hover:scale-105 transition-all duration-300 hover:underline'><Link> Manage Users</Link></li>
        </ul>
      </div>

      {/* header */}
      <div>
        <div>
         <p className=''>Dashboard</p> 
         <h3 className='text-2xl font-bold'>Welcome back, <span className='bg-linear-to-br from-black/60 via-black/70  to-black bg-clip-text text-transparent'>{user?.username} </span> </h3>
        </div>
      </div>

      {/* stats */}
      <div>

      {/* stats */}
      <div className='grid grid-cols-2 '>
        {
          stats.map((stat) => {
            const Icon = stat.icon;
            return(
            <div
            key={stat.title}
            className='bg-black p-6 border border-slate-300 shadow text-white'
            >
              <div className='flex gap-2'>
              <Icon />
              <h3 className='font-semibold'>{stat.title}</h3>
              </div>

              <div className='font-semibold mt-2'>
                {stat.value}
              </div>
            </div>
          )})
        }
      </div>

        {/* graph */}
        <div>

        </div>

      </div>
    </div>
  )
}

export default AdminDashboard