import { links } from "../data/SidebarLinks";
import {Link, useLocation} from "react-router-dom"


export default function Sidebar() {
  const {pathname} = useLocation()
  return (
    <div className="px-6 py-4 h-full text-primary border-r border-gray-200">
        <Link to='/' className="text-2xl font-bold uppercase cursor-pointer">prusloc</Link>
        <div className="my-8">
            {links?.map((link)=>{
              const styles = pathname === link.href ? 'bg-primary text-white hover:bg-primary':'hover:bg-violet-50'
              return(
                <div className={`w-full group ${styles} rounded-md`}>
                    <Link to={link.href} className={`w-full h-full py-2.5 px-3 my-2 font-semibold flex items-center group-hover:translate-x-2 duration-500 gap-2 `}>{link.icon}&nbsp;{link.title}</Link>
                </div>
              )
            })}
        </div>
    </div>
  )
}
