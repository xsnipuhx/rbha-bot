import React, {useEffect} from 'react'

import wretch from 'wretch'

export default ({location}) => {
  const params = new URLSearchParams(location.search)
  const token = params.get("state")
  const code = params.get("code")

  useEffect(() => {
    console.log({token, code})
    
    wretch()
      .url(`./auth/accept`)
      .content("application/json")
      .post({ token, code })
      .json()
      .then( r => {
        console.log("response", r)
      })
  }, [location.search])

  
  return (
    <div>
      loading
    </div>
  )
}