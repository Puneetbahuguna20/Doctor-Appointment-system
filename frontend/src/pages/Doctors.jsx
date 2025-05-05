
import React, { useEffect,useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
// import Loader from '../components/Loader.jsx'

const Doctor = () => {
  const {speciality} = useParams()
  const [filterDoc, setFilterDoc ]= useState([])
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const {doctors} = useContext(AppContext)

  const applyFilter =()=>{
  if (doctors.length>0){
    if(speciality){
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    }
    else{
      setFilterDoc(doctors)
    }
  }
}


useEffect(() => {
  if (doctors.length > 0) {
    setTimeout(() => {
      setLoading(false);
    }, 1);
  }
}, [doctors]);


  useEffect(()=>{
    applyFilter()
  },[doctors,speciality]
)
      
  return (
  <div>
    <p className='text-gray-600'>Browse through the doctors speciality</p>
    <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
      <div className='flex flex-col gap-4 text-sm text-gray-600 '>
        <p onClick={()=>{ if( speciality != 'General physician') {navigate('/doctors/General physician')  }}} className={` w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""  }  `} >General physician</p>
        <p onClick={()=>{ if( speciality != 'Pediatricians'){ navigate('/doctors/Pediatricians')  }}} className={` w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""  }  `} >Pediatricians</p>
        <p onClick={()=>{ if( speciality != 'Gynecologist') {navigate('/doctors/Gynecologist')  }}} className={` w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""  }  `} >Gynecologist</p>
        <p onClick={()=>{ if( speciality != 'Dermatologist') {navigate('/doctors/Dermatologist')  }}} className={` w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""  }  `} >Dermatologist</p>
        <p onClick={()=>{ if( speciality != 'Neurologist') {navigate('/doctors/Neurologist')  }}} className={` w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""  }  `} >Neurologist</p>
        <p onClick={()=>{ if( speciality != 'Gastroenterologist') {navigate('/doctors/Gastroenterologist')  }}} className={` w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""  }  `} >Gastroenterologist</p>
      </div>
    
{
  loading ? ( // Show loader while loading
    <div className="flex justify-center items-center h-96 w-full ">
      {/* <Loader /> */}
    </div>
  ) : (
    <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 gap-y-6">
      {filterDoc.map((item, index) => (
        <div
          onClick={() => navigate(`/my-appointment/${item._id}`)}
          className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          key={index}
        >
          <img className="bg-blue-50" src={item.image} alt="" />
          <div className="p-4">
            <div
              className={`flex items-center gap-2 text-sm text-center ${
                item.available ? "text-green-500" : "text-gray-500"
              }`}
            >
              <p
                className={`w-2 h-2 ${
                  item.available ? "bg-green-500" : "bg-gray-500"
                } rounded-full`}
              ></p>
              <p>{item.available ? "Available" : "Not Available"}</p>
            </div>
            <p className="text-gray-900 max-sm:text-[16px] text-lg font-medium">{item.name}</p>
            <p className="text-gray-600 text-sm">{item.speciality}</p>
          </div>
        </div>
      ))}
    </div>
  )
}


    </div>

  </div>
  )
}

export default Doctor
