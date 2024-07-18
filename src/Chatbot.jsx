import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';
import Loader from './Loader';

const Chatbot = () => {
  const [inputText, setInputText] = useState('');
  const [responses, setResponses] = useState('');
  const [joke, setJoke] = useState('');
  const [loader, setLoader] = useState(false);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      // Send message to Flask backend
      const response = await axios.post('http://127.0.0.1:5000/Chatbot', { message: inputText });
      const { response: chatbotResponse, joke } = response.data;
      
      // Update state with chatbot response and joke
      setResponses(chatbotResponse);
      setJoke(joke);
      setInputText('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="chatbot-container">
      <form onSubmit={handleMessageSubmit} className="message-form">
        <input
          className='input-text'
          type="text"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
          </svg>
        </button>
      </form>
      <div className="chatbot-response">
        <p>
          {loader ? <Loader /> : responses}
        </p>
      </div>
      <div className="chatbot-joke">
        {joke && <p>{joke}</p>}
      </div>
    </div>
  );
};

export default Chatbot;