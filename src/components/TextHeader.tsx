import { links } from "../data/SidebarLinks"


export default function TextHeader({title, link}:TextHeaderProps) {

    const currentLink = links.filter((link)=>link.title.toLowerCase() === title.toLowerCase())

  return (
    <h2 className="font-bold text-xl ml-4 text-[#30415b] flex gap-2 items-center">{currentLink[0].icon}{title}{link}</h2>
  )
}


interface TextHeaderProps{
    title:string;
    link?:string;
}