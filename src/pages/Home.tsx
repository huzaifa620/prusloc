import { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import TextHeader from '../components/TextHeader';
import { links } from '../data/SidebarLinks';
import { Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody } from "@tremor/react";
import { UserAddIcon, PencilIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/solid";
import { ScriptContext } from "../contexts/Context";

export type Users = {
  id: number;
  username: string;
  password: string;
  tasks: string;
};

export default function Home() {
  const { isInput, setIsInput } = useContext(ScriptContext);

  const [userName, setUserName] = useState<string>('')

  useLayoutEffect(() => {
    const username = localStorage.getItem("username");
    setUserName(username || '');
  }, [userName])

  const [users, setUsers] = useState<Users[]>([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [editableUserId, setEditableUserId] = useState<number | null>(null);
  const [editedTasks, setEditedTasks] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/data/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.log('Error fetching users:', response.status);
      }
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
        }),
      });
      
      if (response.ok) {
        fetchUsers();
        setIsInput(false);
        setNewUser({ username: '', password: '' });
        setLoading(false)
      } else {
        console.log('Error creating user:', response.status);
        setLoading(false)
      }
    } catch (error) {
      console.log('Error creating user:', error);
    }
  };

  const editUser = async (userId: number) => {
    if (editableUserId === userId) {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/edit-user/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tasks: editedTasks }),
        });
  
        if (response.ok) {
          setEditableUserId(null);
          setEditedTasks('');
          fetchUsers();
        } else {
          console.log('Error updating user:', response.status);
        }
      } catch (error) {
        console.log('Error updating user:', error);
      }
    } else {
      // User is not currently being edited, start editing
      const userToEdit = users.find(user => user.id === userId);
      if (userToEdit) {
        setEditableUserId(userId);
        setEditedTasks(userToEdit.tasks);
      }
    }
  };
  
  const deleteUser = async (userId: number) => {
    if (deleteConfirmation === userId) {
      // User confirmed deletion
      try {
        const response = await fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/delete-user/${userId}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          setDeleteConfirmation(null);
          fetchUsers();
        } else {
          console.log('Error deleting user:', response.status);
        }
      } catch (error) {
        console.log('Error deleting user:', error);
      }
    } else {
      setDeleteConfirmation(userId);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
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

      {
        userName === 'adminangel' ? (

          <>
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-8 items-center justify-between w-full px-8">

              <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-2 w-3/5">

              </div>

              <button
                className="mt-4 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark flex items-center justify-center space-x-2 group"
                onClick={() => setIsInput(!isInput)} >
                  <UserAddIcon className="h-8 w-8 transform group-hover:animate-pulse" />
                  <p>Create User</p>
              </button>

            </div>
            
            <Table className="mt-4 h-[85%] 2xl:h-[60%] border rounded-xl bg-white shadow-2xl">
              <TableHead className="bg-primary">
                <TableRow>
                  <TableHeaderCell className="uppercase text-white text-center">
                    Username
                  </TableHeaderCell>
                  <TableHeaderCell className="uppercase text-white text-center">
                    Tasks
                  </TableHeaderCell>
                  <TableHeaderCell className="uppercase text-white text-center">
                    Action
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody className="font-semibold text-tremor-content-emphasis">
                {users.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">{item.username}</TableCell>
                    <TableCell className="text-center whitespace-normal">
                      {editableUserId === item.id ? (
                        <input
                          type="text"
                          name="tasks"
                          value={editedTasks}
                          onChange={(e) => setEditedTasks(e.target.value)}
                          className='border-2 rounded-xl p-2 w-full'
                        />
                      ) : (
                        item.tasks
                      )}
                    </TableCell>
                    <TableCell className="text-center flex items-center justify-center space-x-4">
                      <button
                        onClick={() => editUser(item.id)}
                        className={`flex items-center justify-center text-white ${editableUserId === item.id && 'bg-teal-500'} bg-blue-500 px-4 py-2 rounded-lg hover:underline`}
                      >
                        {editableUserId === item.id ? (
                          <div className='flex items-center justify-center space-x-2'>
                            <CheckCircleIcon className='h-6 w-6 text-white' />
                            <p>Confirm</p>
                          </div>
                        ) : (
                          <div className='flex items-center justify-center space-x-2'>
                            <PencilIcon className='h-6 w-6 text-white' />
                            <p>Edit</p>
                          </div>
                        )}
                      </button>
                      <button
                        onClick={() => deleteUser(item.id)}
                        className={`flex items-center justify-center text-white ${deleteConfirmation === item.id && 'bg-teal-500'} bg-red-500 px-4 py-2 rounded-lg hover:underline`}
                      >
                        {deleteConfirmation === item.id ? (
                          <div className='flex items-center justify-center space-x-2'>
                            <CheckCircleIcon className='h-6 w-6 text-white' />
                            <p>Confirm</p>
                          </div>
                        ) : (
                          <div className='flex items-center justify-center space-x-2'>
                            <TrashIcon className='h-6 w-6 text-white' />
                            <p>Delete</p>
                          </div>
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )
        :
        (
          <div className='flex flex-col items-center p-8 mt-10 space-y-4'>
            <h1 className='text-xl text-primary font-bold'>
              TASKS
            </h1>
            <div className='bg-white py-4 rounded-3xl shadow-2xl border w-full px-8'>
              {
                users.find((user) => user.username === userName)?.tasks
              }
            </div> 
          </div>
        )
      }

      {isInput && (

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative w-11/12 lg:w-1/2 h-4/5">
            
            <div className="absolute top-4 right-4 md:top-4 md:right-4 xl:top-8 xl:right-12">
              <button onClick={() => setIsInput(!isInput)} className="w-8 h-8 bg-primary text-white rounded-full hover:opacity-75 flex items-center justify-center" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="bg-white shadow-2xl p-4 rounded-2xl flex items-center justify-center w-full h-full">
              <div className="w-full h-full overflow-y-auto">

                <div className="flex flex-col items-center justify-center space-y-4 h-full w-full">

                  <div className="flex flex-col space-y-2 border p-4 shadow-xl rounded-2xl w-1/2">
                    <label className="block font-bold">Login Credentials</label>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center justify-between w-full">
                        <h2 className="w-[30%]">Username</h2>
                        <input
                          type="text"
                          name="username"
                          value={newUser.username}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded p-2 w-[70%] shadow-lg"
                        />
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <h2 className="w-[30%]">Password</h2>
                        <input
                          type="password"
                          name="password"
                          value={newUser.password}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded p-2 w-[70%] shadow-lg"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 pt-4 shadow-xl rounded-3xl w-1/2 justify-center">
                    <button onClick={createUser} type='submit' className={`px-4 py-2 bg-primary text-white hover:bg-opacity-90 rounded cursor-pointer`}>
                    {
                      loading ? (
                        <div className="flex items-center justify-center space-x-2 px-4 py-2">
                          <div className="w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
                          <span>Creating...</span>
                        </div>
                      )
                      :
                      (
                        <div>
                          Confirm
                        </div>
                      )
                    }
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

      )}

    </div>
  );
}