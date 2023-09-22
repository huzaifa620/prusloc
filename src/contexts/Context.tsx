import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

export type isInput = boolean;

export interface ScriptContextInterface {
    isInput: isInput,
    setIsInput: Dispatch<SetStateAction<isInput>>
}

const defaultState = { 
    isInput: false,
    setIsInput: (isInput: isInput) => {}
} as ScriptContextInterface

export const ScriptContext = createContext<ScriptContextInterface>(defaultState)

type InputProvideProps = {
    children: ReactNode
}

export default function InputProvider({children}: InputProvideProps){
    const [isInput, setIsInput] = useState<isInput>(false)

    return (
        <ScriptContext.Provider value={{ isInput, setIsInput}}>
            {children}
        </ScriptContext.Provider>
    )
}