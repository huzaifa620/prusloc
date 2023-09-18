import {Link} from 'react-router-dom'
import {BiLockAlt} from 'react-icons/bi'

export default function Form({info,setValues}:FormProps) {

    function handleValues(e:any){
        setValues((prev:any)=>({...prev,[e.target.name]:e.target.value}))
    }

  return (
    <div className="bg-white">
        <div className='bg-primary text-white w-16 h-16 text-3xl flex justify-center items-center rounded-full mx-auto'><BiLockAlt/></div>
        <h2 className="text-3xl font-semibold text-primary text-center my-4 uppercase">{info.heading}</h2>
        <div className="mt-6 mb-8">
            {info.fields.map((field:any)=>(
                <div className="my-4">
                    <label className="font-medium text-lg text-primary">{field.title}</label><br />
                    <input className="mt-2 bg-gray-100 px-4 py-3 w-80 outline-none rounded-md" type={field.type} name={field.name} value={field.value} onChange={handleValues}/>
                </div>
            ))}
        </div>
        <div>
            <button className="w-80 bg-primary text-white py-3 text-lg font-medium rounded-md">{info.buttonText}</button>
        </div>
        <div className='mt-8 text-primary'>
            <p>{info.routeDetails.message}&nbsp;<Link to={info.routeDetails.linkRoute} className='text-primary font-semibold'>{info.routeDetails.linkTitle}</Link></p>
        </div>
    </div>
  )
}

interface FormProps{
    info:any
    setValues:(newVal:any)=>void
}