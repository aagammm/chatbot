import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [joke, setJoke] = useState('');

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send message to Flask backend
      const response = await axios.post('/chatbot', { message: inputText });
      const { response: chatbotResponse, joke } = response.data;

      // Update state with chatbot response and joke
      setResponse(chatbotResponse);
      setJoke(joke);
      setInputText('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="chatbot-container">
      <form onSubmit={handleMessageSubmit} className="message-form">
        <input
          type="text"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div className="chatbot-response">
        <p>{response}</p>
      </div>
      <div className="chatbot-joke">
        {joke && <p>{joke}</p>}
      </div>
    </div>
  );
};

export default Chatbot;
