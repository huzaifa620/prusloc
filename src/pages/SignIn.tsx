import { BiLockAlt } from 'react-icons/bi';
import { useState } from 'react';

interface FormValues {
  [key: string]: string;
}

const initialValue = { username: '', password: '' };

export default function SignIn() {
  const [values, setValues] = useState<FormValues>(initialValue);
  const [error, setError] = useState('');

  const info = {
    heading: 'Sign In',
    fields: [
      { title: 'Username', name: 'username', type: 'text', value: values.username },
      { title: 'Password', name: 'password', type: 'password', value: values.password },
    ],
    buttonText: 'Sign In',
  };

  async function handleSignIn() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Sign-in successful, you can redirect the user to a different page or perform any other actions
        console.log('Sign-in successful');
        setError('');
      } else {
        // Sign-in failed, display an error message
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError('An error occurred while signing in');
    }
  }

  function handleValues(e: any) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white flex flex-col items-center justify-center space-y-4">
        <div className="bg-primary text-white w-16 h-16 text-3xl flex justify-center items-center rounded-full mx-auto">
          <BiLockAlt />
        </div>
        <h2 className="text-3xl font-semibold text-primary text-center uppercase">{info.heading}</h2>
        <div className="">
          {info.fields.map((field) => (
            <div className="my-4" key={field.name}>
              <label className="font-medium text-lg text-primary">{field.title}</label><br />
              <input
                className="mt-2 bg-gray-100 px-4 py-3 w-80 outline-none rounded-md"
                required
                type={field.type}
                name={field.name}
                value={values[field.name]}
                onChange={handleValues}
              />
            </div>
          ))}
        </div>
        {error && <div className="text-red-500 text-center font-bold tracking-widest">{error}</div>}
        <div>
          <button
            className="w-80 bg-primary text-white py-3 text-lg font-medium rounded-md"
            onClick={handleSignIn}
          >
            {info.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
