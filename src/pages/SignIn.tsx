import Form from "../components/Form";
import {useState} from 'react'

const initialValue = {email:'',password:''}

export default function SignIn() {
    const [values,setValues] = useState(initialValue)

    const info = {
        heading:'Sign In',
        fields:[
            {title:'Email',name:'email',type:'email',value:values.email},
            {title:'Password',name:'password',type:'password',value:values.password},
        ],
        buttonText:'Sign In',
        routeDetails:{message:'Create a new Account?',linkTitle:'Sign Up',linkRoute:'/sign-up'}
    }
    

  return (
    <div className="min-h-screen flex justify-center items-center">
        <Form info={info} setValues={setValues}/>
    </div>
  )
}
