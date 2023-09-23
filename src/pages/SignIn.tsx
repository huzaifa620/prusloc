import { BiLockAlt } from 'react-icons/bi';
import { useState } from 'react';

const initialValue = { username: '', password: '' };

export default function SignIn() {
  const [values, setValues] = useState(initialValue);

  const info = {
    heading: 'Sign In',
    fields: [
      { title: 'Username', name: 'username', type: 'text', value: values.username },
      { title: 'Password', name: 'password', type: 'password', value: values.password },
    ],
    buttonText: 'Sign In',
  };

  function handleValues(e: any) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white">
        <div className="bg-primary text-white w-16 h-16 text-3xl flex justify-center items-center rounded-full mx-auto">
          <BiLockAlt />
        </div>
        <h2 className="text-3xl font-semibold text-primary text-center my-4 uppercase">{info.heading}</h2>
        <div className="mt-6 mb-8">
          {info.fields.map((field) => (
            <div className="my-4" key={field.name}>
              <label className="font-medium text-lg text-primary">{field.title}</label><br />
              <input
                className="mt-2 bg-gray-100 px-4 py-3 w-80 outline-none rounded-md"
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={handleValues}
              />
            </div>
          ))}
        </div>
        <div>
          <button className="w-80 bg-primary text-white py-3 text-lg font-medium rounded-md">
            {info.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
