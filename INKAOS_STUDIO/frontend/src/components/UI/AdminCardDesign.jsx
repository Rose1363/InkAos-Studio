import React from 'react'

const AdminCardDesign = ({data}) => {
  return (
    <div className="w-50 border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
    <div>
      <img
        src={data?.thumbnail}
        alt={data.name}
        className="border-b border-gray-400 w-full h-full hover:scale-105 transition-transform duration-300"
      />
    </div>

    <div className="my-3">
      <p
        className="px-1 text-center font-semibold text-sm text-gray-800 truncate"
        title={data?.name}
      >
        {data?.name}
      </p>
      <div className="flex gap-3 p-1">
        <p className="text-center font-bold text-md text-primary mt-1">
          {(data?.basePrice)}
        </p>
        <p className="ml-auto font-bold text-md text-primary mt-1">
          {data?.style}
        </p>
      </div>
    </div>
  </div>
  )
}

export default AdminCardDesign