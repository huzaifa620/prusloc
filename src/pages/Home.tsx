import { Link } from "react-router-dom"
import TextHeader from "../components/TextHeader"
import { links } from "../data/SidebarLinks"


export default function Home() {
  return (
    <div className="w-full h-full">
      <TextHeader title="Dashboard"/>
      <div className="grid grid-cols-3 w-full mt-8 text-primary">
        {links.slice(1).map((el)=>(
          <div className="relative border shadow-lg from-white via-red-50 to-cyan-100 bg-gradient-to-br w-64 h-48 justify-self-center flex justify-center items-center rounded-md  col-span-1 px-4 py-2 group">
            <span className="absolute top-0 left-0 py-1 px-2 bg-primary text-white rounded-tl-md rounded-br-md font-medium">{el.title}</span>
            <div className="text-3xl bg-primary text-white w-16 h-16 rounded-full flex justify-center items-center">{el.value}</div>
            <Link to={el.href} className="w-full text-center absolute bottom-0 py-1.5 px-2 bg-primary text-white rounded-br-md rounded-bl-md font-medium opacity-0 group-hover:opacity-100 duration-500">View</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
