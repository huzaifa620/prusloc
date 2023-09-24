import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

export type User = {
    username: string
    tasks: string
};

export interface UserContextInterface {
    user: User,
    setUser: Dispatch<SetStateAction<User>>
}

const defaultState = { 
    user: {
        username: '',
        tasks: ''
    },
    setUser: (_: User) => {}
} as UserContextInterface

export const UserContext = createContext<UserContextInterface>(defaultState)

type InputProvideProps = {
    children: ReactNode
}

export default function InputProvider({children}: InputProvideProps){
    const [user, setUser] = useState<User>({
        username: '',
        tasks: ''
    })

    return (
        <UserContext.Provider value={{ user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}