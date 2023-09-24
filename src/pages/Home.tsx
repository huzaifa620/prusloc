"use client";

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TextHeader from '../components/TextHeader';
import { links } from '../data/SidebarLinks';
import { Table,TableRow, TableCell, TableHead, TableHeaderCell,TableBody } from "@tremor/react";
import { UserAddIcon } from "@heroicons/react/solid";


export type Users = {
  id: number;
  username: string;
  password: string;
  tasks: string
};

export default function Home() {

  const [users, setUsers] = useState<Users[]>([]);
  
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

      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-8 items-center justify-between w-full px-8">

        <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-2 w-3/5">

          {/* <Select className="max-w-full sm:max-w-xs" onValueChange={setSelectedDate} placeholder="Select Date...">
              {[...new Set(data.map((item) => item.date_ran))].map((date) => (
                  <SelectItem key={date} value={date}>
                      {date}
                  </SelectItem>
              ))}
          </Select> */}

        </div>

        <button
          className="mt-4 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark hover:bg-opacity-90 flex items-center justify-center space-x-2 group"
          onClick={createUser}
        >
          <UserAddIcon className="h-8 w-8 transform group-hover:animate-pulse " />
          <p>Create User</p>
        </button>

      </div>
      
      <Table className="mt-4 h-[85%] 2xl:h-[60%] border rounded-xl bg-white shadow-2xl">

        <TableHead className="bg-primary">
            <TableRow>
              <TableHeaderCell className={`uppercase text-white text-center`}>
                Username
              </TableHeaderCell>
              <TableHeaderCell className={`uppercase text-white text-center`}>
                Tasks
              </TableHeaderCell>
            </TableRow>
        </TableHead>

        <TableBody className="font-semibold text-tremor-content-emphasis">
          {users.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{item.username}</TableCell>
                <TableCell className="text-center">{item.tasks}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        
      </Table>

    </div>
  );
}
