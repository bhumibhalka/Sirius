import React, { lazy, Suspense } from 'react'
import Navbar from '../../components/UI/Navbar'
import {Link } from "react-router-dom"

const ShopTheLook = lazy(() => import('../../components/UI/ShopTheLook'))
const TheEssentials = lazy(() => import('../../components/UI/TheEssentials'))
const Footer = lazy(() => import('../../components/UI/Footer'))

const SectionFallback = () => {
  <div className='w-full animate-spin bg-slate-200 min-h-[40vh]'/>
}


const HomePage = () => {
  return (
    <div >
        <main >



<section className='relative h-screen w-full overflow-hidden'>

  {/* VIDEO */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className='absolute inset-0 w-full h-full object-cover'
  >
    <source src="/head_video.mp4" type="video/mp4" />
  </video>

  {/* OVERLAY */}
  <div className='absolute inset-0 bg-black/40'></div>

  {/* CONTENT */}
  <div className='relative z-10 flex h-full items-center justify-center text-center text-white'>
    <div>
      <p className="text-xs tracking-widest">
        ELEGANCE REDEFINED
      </p>

      <h1 className="text-3xl md:text-6xl font-semibold tracking-wide mt-3 mb-5 md:mb-8">
        The Art of Quiet Luxury
      </h1>

      <button className="border py-3 px-10 text-xs hover:underline">
        <Link to="/user/products">
          EXPLORE COLLECTION
        </Link>
      </button>
    </div>
  </div>

</section>

      {/* SHOP THE LOOK */} 
       <Suspense fallback={<SectionFallback />}>
         <ShopTheLook />
       </Suspense>



      {/* QUOTE */}
        <section className="bg-slate-100 min-h-[50vh] flex items-center justify-center">
          <div >
             <div className="text-center relative">
                <p className="text-amber-600 text-4xl">❞</p>
              
                <p className="text-4xl mt-4 mb-6">
                〝Luxury is not about being noticed, it 
                <br /> is about being remembered for the 
                <br />
                 soul within the craft.〞
                 </p>

                <hr className="text-amber-600 h-px w-12 absolute left-1/2 -translate-x-1/2"/>

                 <p className="pt-2 tracking-widest text-sm">THE LUMIÈRE</p>
             </div>
          </div>
        </section>
    
    {/* THE ESSENTIALS */}
      <Suspense fallback={<SectionFallback />}>
         <TheEssentials />
      </Suspense>
      
       {/* FOOTER */}
      <Suspense fallback={<SectionFallback />}>
         <TheEssentials />
      </Suspense>
        
        </main>
    
    </div>
  )
}

export default HomePage

          {/* HERO */}
        {/* <section className=' bg-no-repeat bg-cover bg-center h-screen w-full flex items-center justify-center text-white text-center'>

          {/* VIDEO */}
  // <video
  //   autoPlay
  //   loop
  //   muted
  //   playsInline
  //   className='absolute top-0 left-0 w-full h-full object-cover'
  // >
  //   <source src="/head_video.mp4" type="video/mp4" />
  // </video>


  //          <div>
  //           <p className="text-xs tracking-widest">ELEGANCE REDEFINED</p>
  //           <h1 className="text-3xl md:text-6xl font-semibold tracking-wide mt-3 mb-5 md:mb-8">The Art of Quite Luxury</h1>

  //           <button className="border py-3 px-10 text-xs hover:underline ">
  //           <Link to="/user/products" >EXPLORE COLLECTION</Link>
  //           </button>

  //          </div>
        {/* </section> */} 

 {/* <img src="/main.webp" alt="" className='h-screen object-cover' /> */}