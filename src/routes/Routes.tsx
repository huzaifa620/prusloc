import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Outlet,
  } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Scripts from "../pages/Scripts";
import Database from "../pages/Database";
import DefaultInputs from "../pages/DefaultInputs";

const AppLayout = ()=>{
  return(
    <div className="grid grid-cols-5 bg-white/60 backdrop-blur">
      <div className="col-span-1">
          <Sidebar/>
      </div>
      <div className="col-span-4 px-4 py-6 bg-gray-100">
          <Outlet/>
      </div>
    </div>
  )
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/sign-in" element={<SignIn />}/>
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="/*" element={<AppLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="scripts" element={<Scripts/>}/>
      <Route path="database" element={<Database/>}/>
      <Route path="default-inputs" element={<DefaultInputs/>}/>
    </Route>
    </>
  )
);