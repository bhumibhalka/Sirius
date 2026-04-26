import React from 'react'
import Navbar from '../../components/UI/Navbar'
import {Link } from "react-router-dom"
import ShopTheLook from '../../components/UI/ShopTheLook'
import TheEssentials from '../../components/UI/TheEssentials'
import Footer from "../../components/UI/Footer"

const HomePage = () => {
  return (
    <div >


        <Navbar className='shadow' />

        <main className=''>

          {/* main */}
        <section className='bg-[url("/images.jpeg")] bg-no-repeat bg-cover bg-center h-screen w-full flex items-center justify-center text-white text-center'>
           <div>
            <p className="text-xs tracking-widest">ELEGANCE REDEFINED</p>
            <h1 className="text-3xl md:text-6xl font-semibold tracking-wide mt-3 mb-5 md:mb-8">The Art of Quite Luxury</h1>

            <button className="border py-3 px-10 text-xs ">
            <Link to="/user/products/collection" >EXPLORE COLLECTION</Link>
            </button>

           </div>
        </section>


      {/* SHOP THE LOOK */}
        <div>
        <ShopTheLook />
        </div>


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
    

       <TheEssentials />
      
       {/* FOOTER */}
       <Footer />
        
        </main>
    
    </div>
  )
}

export default HomePage

 {/* <img src="/main.webp" alt="" className='h-screen object-cover' /> */}