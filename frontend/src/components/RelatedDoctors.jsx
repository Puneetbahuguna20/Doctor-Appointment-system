import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {

      const navigate = useNavigate()
      const { doctors } = useContext(AppContext)
      const [relDoc, setRelDoc] = useState([])

      useEffect(() => {
            if (doctors?.length > 0 && speciality) {
                  const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
                  setRelDoc(doctorsData)
            }
      }, [doctors, speciality, docId])

      return (
            <div className='flex flex-col items-center gap-4 my-16 text-gray-900 sm:mx-10'>
                  <h1 className='text-3xl font-medium'>Related Doctors</h1>
                  <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
                  <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                        {
                              relDoc.slice(0, 5).map((item) => (
                                    <div key={item._id} onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                                          <img className='bg-blue-50' src={item.image} alt="" />
                                          <div className='p-4'>
                                                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                                <p className='text-gray-600 text-sm'>{item.speciality}</p>
                                          </div>
                                    </div>
                              ))
                        }
                  </div>
                  <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
            </div>
      )
}

export default RelatedDoctors