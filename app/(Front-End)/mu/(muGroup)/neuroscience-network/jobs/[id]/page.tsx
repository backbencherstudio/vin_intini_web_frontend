import React from 'react'

function Page({params}: {params: {id: string}}) {
    const networkType = params.id;
  return (
    <div>
        Network type to filter is {networkType}
    </div>
  )
}

export default Page