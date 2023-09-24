import { BiLockAlt } from 'react-icons/bi';
import { useState } from 'react';

interface FormValues {
  [key: string]: string;
}

const initialValue = { username: '', password: '' };

export default function SignIn() {

  const [values, setValues] = useState<FormValues>(initialValue);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, username } = data;

        // Store the token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        
        //setUser(foundUser)
        window.location.href = '/';
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

  function handleValues(e: React.ChangeEvent<HTMLInputElement>) {
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
            className="w-80 bg-primary text-white py-3 text-lg hover:bg-opacity-90 font-medium rounded-md"
            onClick={handleSignIn}
          >
            {
              loading ? (
                <div className="flex items-center justify-center space-x-2 px-4 py-2">
                  <div className="w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
                  <span>Checking...</span>
                </div>
              )
              :
              (
                <div>
                  {info.buttonText}
                </div>
              )
            }
          </button>
        </div>
      </div>
    </div>
  );
}
