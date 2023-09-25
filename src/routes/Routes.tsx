import { createBrowserRouter, createRoutesFromElements, Route, Outlet, Navigate } from "react-router-dom";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import Sidebar from "../components/Sidebar";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import Scripts from "../pages/Scripts";
import Database from "../pages/Database";
import LiveLog from "../pages/LiveLog";
import { links } from "../data/SidebarLinks";
import { useState, useLayoutEffect } from 'react';
import { Link, useLocation } from "react-router-dom";

export function checkToken() {
  const token = localStorage.getItem("token"); 
  return !!token;
}

const AppLayout = () => {
  const hasToken = checkToken();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (!hasToken) {
    return <Navigate to="/sign-in" />;
  }

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
    <div className="grid grid-cols-4 lg:grid-cols-5 bg-white/60 backdrop-blur">
      
      <div className="hidden lg:grid col-span-1">
        <Sidebar />
      </div>

      {
        isSidebarOpen && (

          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
            <div className="relative w-full sm:w-3/4 h-4/5 bg-white">
              <div className="flex items-center justify-center">
                <div className="w-full px-6 py-4 h-full text-primary border-r border-gray-200 flex flex-col justify-between">

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
                            onClick={() => !isSidebarOpen}
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
                      <div className="w-full flex items-center justify-between text-center space-x-2 2xl:space-x-4 bg-primary p-4 rounded-lg shadow-2xl border">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="bg-sky-500 font-extrabold text-white py-2 px-3 2xl:px-4 uppercase rounded-xl"> {userName[0]} </div>
                          <p className="text-white font-bold"> {userName} </p>
                        </div>
                        <button onClick={logout} className="text-2xl 2xl:text-4xl cursor-pointer" title="Logout">
                          ↪️
                        </button>
                      </div>
                    )
                  }

                  </div>
              </div>
            </div>
          </div>
          
        )
      }

      <div className="fixed top-0 left-0 p-6 cursor-pointer lg:hidden z-10" onClick={toggleSidebar}>
        {
          isSidebarOpen ? 
          ( <XIcon className="h-8 w-8 text-primary" />) : (<MenuIcon className="h-8 w-8 text-primary" /> )
        }
        
      </div>

      <div className="col-span-4 px-4 py-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/*" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="scripts" element={<Scripts />} />
        <Route path="database" element={<Database />} />
        <Route path="live-logs" element={<LiveLog />} />
      </Route>
    </>
  )
);
