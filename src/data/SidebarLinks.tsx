import {AiOutlineDatabase} from 'react-icons/ai' 
import {LuLayoutDashboard} from 'react-icons/lu'
import {TbScript} from 'react-icons/tb'
import {MdOutlineSettingsInputComponent} from 'react-icons/md'

export const links = [
    {title:'Dashboard',href:'/',icon:<LuLayoutDashboard/>},
    {title:'Scripts',href:'/scripts',icon:<TbScript/>,value:2},
    {title:'Database',href:'/database',icon:<AiOutlineDatabase/>,value:1},
    {title:'Live Logs',href:'/live-logs',icon:<MdOutlineSettingsInputComponent/>,value:3}
]