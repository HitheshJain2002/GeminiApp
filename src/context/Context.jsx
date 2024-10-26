import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => setResultData(prev => prev + nextWord), 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
   };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        try {
            const response = await runChat(prompt || input);
            const formattedResponse = response
                .split("**").map((text, i) => (i % 2 === 1 ? `<b>${text}</b>` : text)).join("")
                .split("*").join("</br>");
            formattedResponse.split(" ").forEach((word, index) => delayPara(index, word + " "));
            setRecentPrompt(prompt || input);
            if (!prompt) setPrevPrompts([...prevPrompts, input]);
        } catch {
            setResultData("Sorry, something went wrong. Please try again.");
        } finally {
            setLoading(false);
            setInput("");
        }
    }

    return (
        <Context.Provider value={{
            input, setInput, recentPrompt, prevPrompts, showResult, loading, resultData,
            setRecentPrompt, setPrevPrompts, onSent, newChat
        }}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
