import React, { useContext, useEffect, useRef, useState } from 'react';
import './Main.css';
import { assets } from "../../assets/assets.js";
import { Context } from "../../context/Context.jsx";

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    const resultRef = useRef(null);
    const [rows, setRows] = useState(1);

    useEffect(() => {
        const updateRows = () => setRows(window.innerWidth <= 600 ? 2 : 1);
        updateRows();
        window.addEventListener('resize', updateRows);
        return () => window.removeEventListener('resize', updateRows);
    }, []);

    useEffect(() => {
        if (resultRef.current) {
            resultRef.current.scrollTop = resultRef.current.scrollHeight;
        }
    }, [resultData]);

    const suggestionCards = [
        { text: "Suggest beautiful places to see on an upcoming road trip", icon: assets.compass_icon },
        { text: "Briefly summarize this concept: urban planning", icon: assets.bulb_icon },
        { text: "Brainstorm team bonding activities for our work retreat", icon: assets.message_icon },
        { text: "Tell me about React js and React native", icon: assets.code_icon }
    ];

    const renderCards = () => (
        <div className="cards">
            {suggestionCards.map((card, index) => (
                <div key={index} className="card" onClick={() => setInput(card.text)}>
                    <p>{card.text}</p>
                    <img src={card.icon} alt=""/>
                </div>
            ))}
        </div>
    );

    const renderResult = () => (
        <div className='result'>
            <div className="result-title" ref={resultRef}>
                <img src={assets.user_icon} alt=""/>
                <p>{recentPrompt}</p>
           
            </div>
            <div className="result-data"  >
                <img className="result-data-icon" src={assets.gemini_icon} alt=""/>
                {loading ? (
                    <div className='loader'>
                        <hr/><hr/><hr/>
                    </div>
                ) : (
                    <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                )}
            </div>
        </div>
    );

    return (
        <main className="main">
            <nav className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt=""/>
            </nav>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, Hithesh Jain</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        {renderCards()}
                    </>
                ) : renderResult()}

                <div className="main-bottom">
                    <div className="search-box">
                        <textarea
                            rows={rows}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyUp={(e) => e.key === 'Enter' && onSent()}
                            value={input}
                            placeholder="Enter a prompt here"
                        />
                        <div className="icon-container">
                            <button><img src={assets.gallery_icon} alt="Gallery"/></button>
                            <button><img src={assets.mic_icon} alt="Mic"/></button>
                            <button onClick={onSent}><img src={assets.send_icon} alt="Send"/></button>
                        </div>
                    </div>
                    <p className="bottom-info">
                        Gemini may display inaccurate info, including about people, so double-check its responses.
                        <a href="https://github.com/HitheshJain2002?tab=repositories">Your privacy and Gemini Apps</a>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Main;
