import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TextHeader from '../components/TextHeader';
import { links } from '../data/SidebarLinks';

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/data/users`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error fetching users:', response.status);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []);

  const createUser = async () => {
    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ /* Provide user data here */ }),
      });

      if (response.ok) {
        // User created successfully, you can fetch users again or update the state
        console.log('User created successfully');
      } else {
        console.error('Error creating user:', response.status);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="w-full app">
      <TextHeader title="Dashboard" />
      <div className="grid grid-cols-3 w-full mt-8 text-primary">
        {links.slice(1).map((el) => (
          <div
            className="relative border shadow-lg from-white via-red-50 to-cyan-100 bg-gradient-to-br w-64 h-48 justify-self-center flex justify-center items-center rounded-md  col-span-1 px-4 py-2 group"
            key={el.title}
          >
            <span className="absolute top-0 left-0 py-1 px-2 bg-primary text-white rounded-tl-md rounded-br-md font-medium">
              {el.title}
            </span>
            <div className="text-3xl bg-primary text-white w-16 h-16 rounded-full flex justify-center items-center group-hover:animate-bounce">
              {el.value}
            </div>
            <Link
              to={el.href}
              className="w-full text-center absolute bottom-0 py-1.5 px-2 bg-primary text-white rounded-br-md rounded-bl-md font-medium opacity-0 group-hover:opacity-100 duration-500"
            >
              View
            </Link>
          </div>
        ))}
      </div>

      {/* <div className="mt-8">
        <h2 className="text-2xl font-semibold text-primary">User List</h2>
        <table className="mt-4 w-full">
          <thead>
            <tr>
              <th>Username</th>
              <th>Tasks</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.tasks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={createUser}
        className="mt-8 w-40 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark"
      >
        Create User
      </button> */}

    </div>
  );
}
