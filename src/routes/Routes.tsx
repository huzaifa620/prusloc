import { createBrowserRouter, createRoutesFromElements, Route, Outlet, Navigate } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/solid";
import Sidebar from "../components/Sidebar";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import Scripts from "../pages/Scripts";
import Database from "../pages/Database";
import LiveLog from "../pages/LiveLog";

export function checkToken() {
  const token = localStorage.getItem("token"); 
  return !!token;
}

const AppLayout = () => {
  const hasToken = checkToken();
  if (!hasToken) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="grid grid-cols-4 lg:grid-cols-5 bg-white/60 backdrop-blur">
      
      <div className="hidden lg:grid col-span-1">
        <Sidebar />
      </div>

      <div className="fixed top-0 left-0 p-6 cursor-pointer lg:hidden">
        <MenuIcon className="h-8 w-8 text-primary" />
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
