import { Loader, Search, X } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSearchOpen } from '../../store/slices/popup.slice';
import { useState } from 'react';

const SearchSidebar = () => {

  const dispatch = useDispatch();
  const {isSearchOpen} = useSelector(state => state.popup);
  const {items, loading} = useSelector(state => state.user);
  // console.log(items);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = searchTerm.trim() ?  items?.filter((item) => {
   
   return (
     (item.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (item.username || '').toLowerCase().includes(searchTerm.toLowerCase()))

   
  }) : [] ;

  const toggleSearch = () => {
    dispatch(toggleSearchOpen())
  }

  return (
    <div className='bg-black fixed inset-0 z-50 max-w-sm  w-full  border-r border-slate-400 p-6 space-y-6'>
     

     {/* Header */}
     <div className='flex items-center justify-between'>
      <h3 className='text-2xl font-semibold'>Search</h3>
      <X
      onClick={toggleSearch}
      className='hover:scale-110 transition-all duration-300 shadow hover:shadow-white rounded-lg'
      />
     </div>


     {/* search bar */}
      <div className='relative'>
        <Search className='absolute top-2 size-5 text-slate-400 left-2' />
        <input 
        type="text"
        className='input-rounded'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='Search'
         />
         {
           loading ? (
            <Loader className='absolute top-2.5 right-3 size-4 animate-spin'/>
          ) : (
            <X className='absolute top-2.5 right-3 size-4 '
            onClick={() => setSearchTerm('')}
            />
          )
         }
      </div>

     {/* search outputs */}
      <div className='space-y-6'>
        {
          filteredUsers && filteredUsers?.length > 0 ? (
            filteredUsers.map((user) => (
              <div
              key={user.id}
              >

               <div className='flex gap-2'>
                {/* avatar */}
                <div className='bg-white inline-flex'>
                  <img src={user?.avatar} alt="img" className='h-12 rounded-full w-12 object-cover' />
                </div>

                {/* info */}
                <div>
                  <h3>{user?.displayName || 'User'}</h3>
                  <div className='flex gap-2'>
                    <h4>{user?.username || 'User'}</h4> •
                    <p>{user?.followers}</p>
                  </div>
                  </div>
               </div>
               {/* delete */}
               <div></div>

              </div>
            ))
          ) : ("")
        }
      </div>
    

    </div>
  )
}

export default SearchSidebar;