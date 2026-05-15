import { Loader, Search, X } from 'lucide-react'
import React, { memo, useCallback, useDeferredValue, useMemo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { toggleSearchOpen } from '../../store/slices/popup.slice';
import { useState } from 'react';

const SearchSidebar = () => {

  const dispatch = useDispatch();
  const {
    isSearchOpen, 
    items, 
    loading
  } = useSelector((state)=> ({
    isSearchOpen: state.popup.isSearchOpen,
    items: state.user.items,
    loading: state.user.loading,
  }),
shallowEqual
)

  // console.log(items);

  const [searchTerm, setSearchTerm] = useState('');

  const defferedSearchTerm = useDeferredValue(searchTerm);

  const filteredUsers = useMemo(()=> {
    if(!defferedSearchTerm.trim()) return [];

    const normalizedSearch = defferedSearchTerm.toLowerCase();

    return items?.filter((item) => {

      return (
        (item?.displayName || '')
        .toLowerCase()
        .includes(normalizedSearch)
      
        ||
        
        (item?.username || '')
        .toLowerCase()
        .includes(normalizedSearch)

      )
    })
  },[ items, defferedSearchTerm])

  const toggleSearch = useCallback(() => {
    dispatch(toggleSearchOpen())
  },[dispatch])

  const clearSearch = useCallback(()=> {
    setSearchTerm('')
  },[])

  const handleSearch = useCallback((e) => {
   setSearchTerm(e.target.value);
  },[]);

  if(!isSearchOpen) return;

  return (
    <div className='bg-black fixed inset-0 z-50 max-w-sm  w-full  border-r border-slate-400 p-6 space-y-6'>
     

     {/* HEADER */}
     <div className='flex items-center justify-between'>
      <h3 className='text-2xl font-semibold'>Search</h3>
      <X
      onClick={toggleSearch}
      className='hover:scale-110 transition-all duration-300 shadow hover:shadow-white rounded-lg'
      />
     </div>


     {/* SEARCH BAR */}
      <div className='relative'>

        <Search className='absolute top-2 size-5 text-slate-400 left-2' />

        <input 
        type="text"
        className='input-rounded'
        value={searchTerm}
        onChange={handleSearch}
        placeholder='Search'
         />

         {
           loading ? (

            <Loader className='absolute top-2.5 right-3 size-4 animate-spin'/>

          ) : searchTerm &&  (


            <button
            onClick={clearSearch}
            aria-label='Clear Search'
            >
              <X  className='absolute top-2.5 right-3 size-4 '/>
            </button>

          )
         }
      </div>

     {/* SEARCH RESULTS */}
      <div className='space-y-6 overflow-y-auto max-h-[80vh]'>

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
          ) : (

           !loading &&  defferedSearchTerm.trim() && (

              <div className='text-center text-slate-400 text-sm'>
                No users found
              </div>

            )
          )
        }
      </div>
    

    </div>
  )
}

export default memo(SearchSidebar) ;