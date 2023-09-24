import { links } from "../data/SidebarLinks";
import { useState, useLayoutEffect } from 'react';
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {

  const { pathname } = useLocation();
  const [userName, setUserName] = useState<string>('')

  useLayoutEffect(() => {
    const username = localStorage.getItem("username");
    setUserName(username || '');
  }, [userName])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    window.location.href = 'sign-in'
  };

  return (
    <div className="px-6 py-4 h-full text-primary border-r border-gray-200 flex flex-col justify-between">

      <div>
        <Link to="/" className="text-2xl font-bold uppercase cursor-pointer">
          prusloc
        </Link>

        <div className="my-8">
          {links?.map((link) => {
            const styles =
              pathname === link.href ? "bg-primary text-white hover:bg-primary" : "hover:bg-violet-50";
            return (
              <div
                className={`w-full group ${styles} rounded-md`}
                key={link.title}
              >
                <Link
                  to={link.href}
                  className={`w-full h-full py-2.5 px-3 my-2 font-semibold flex items-center group-hover:translate-x-2 duration-500 gap-2 `}
                >
                  {link.icon}&nbsp;{link.title}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      
      { userName && 
        (
          <div className="w-full flex items-center justify-between text-center space-x-4 bg-primary p-4 rounded-lg shadow-2xl border">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-sky-500 font-extrabold text-white py-2 px-4 uppercase rounded-xl"> {userName[0]} </div>
              <p className="text-white font-bold"> {userName} </p>
            </div>
            <button onClick={logout} className="text-4xl cursor-pointer" title="Logout">
              ↪️
            </button>
          </div>
        )
      }

    </div>
  );
}
