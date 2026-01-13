import React, { useEffect } from 'react'
import Auth from './pages/Auth'
import ShortUrl from './pages/ShortUrl'
import { useAppContext } from './context/AppContext';

const App = () => {
  const { user, fetchUser, token } = useAppContext();

  useEffect(() => {
    fetchUser()
  }, [user, token])

  return (
    <div className=''>
      {token ? <ShortUrl /> : <Auth />}
    </div>
  )
}

export default App