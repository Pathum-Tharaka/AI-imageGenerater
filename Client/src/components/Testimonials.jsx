import React from 'react'
import { assets,testimonialsData } from '../assets/assets'

const Testimonials = () => {
  return (
    <div className="flex flex-col justify-center items-center my-20 py-12">
      <h1 className="text-3xl sm:text-4xl mb-2 font-semibold">
      Customer testimonials      </h1>
      <p className="mb-12 text-gray-500">What Our Users Are Saying</p>

        <div className='flex flex-wrap gap-6'>
            {testimonialsData.map((item, index) => (
                <div className='bg-white/20 p-12 shadow-md border w-80 m-auto cursor-pointer hover:scale-[1.02] transition-all rounded-lg' key={index}>
                    <div className='flex flex-col items-center'>
                        <img src={item.image} alt="" className='rounded-full w-14' />
                        <h2 className='text-xl font-semibold mt-3'>{item.name}</h2>
                        <p className='text-gray-500 mb-4'>{item.role}</p>
                            <div className='flex mb-4'>
                                {Array (item.stars).fill().map((testimonial, index) => (
                                    <img key={index} src={assets.rating_star} alt="" />

                                    
                                ))}
                            </div>
                            <p className='text-gray-600 text-center text-sm'>{item.text}</p>
                    </div>
                    </div>
            ))}
        </div>

    </div>
  )
}

export default Testimonials
