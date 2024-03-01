import './App.css';

import React, { useState } from "react";
import { RiMailLine } from 'react-icons/ri';
import { FiCopy } from 'react-icons/fi';
import { FiUser, FiHome } from 'react-icons/fi';

const IReachApp = () => {
  const dummyAccount = {
    title: "No account to show",
    plot: "",
    poster: "https://as1.ftcdn.net/v2/jpg/03/95/42/94/1000_F_395429472_LNyOoV7eRXm76HIIBBHOciyHEtiwS1Ed.jpg",
    imdb: { rating: 0 },
    languages: ["N/A"],
    countries: ["N/A"],
    score: 0
  };

  const user = {
    username: 'John Doe',
    email: 'john@example.com'
  };

  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [selectedOption, setSelectedOption] = useState("Vector");
  const [showOptions, setShowOptions] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [emailText, setEmailText] = useState("");


  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handlePromptChange = (e) => {
    setPromptText(e.target.value);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
  };

  const handleSubmit = (mode) => {
    setAccounts([]);
    fetchAccounts();
  };

  const generateEmail = () => {
    getEmailText();
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch(
        `https://ap-south-1.aws.data.mongodb-api.com/app/ireach-dodfh/endpoint/standardSearch?m=${selectedOption}&key=${apiKey}&s=${encodeURIComponent(searchQuery)}`
      );

      const similarAccounts = (await response.json()).results;

      if (Array.isArray(similarAccounts)) {
        if (similarAccounts.length > 0) {
          setAccounts(similarAccounts);
        }
        else {
          dummyAccount.plot = 'Try again with a different search query';
          setAccounts([dummyAccount]);
        }
      }
      else {
        dummyAccount.plot = 'This could be due to exceeded rate limit. Please try again after some time.';
        setAccounts([dummyAccount]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };


  const copyText = () => {
    navigator.clipboard.writeText(emailText)
      .then(() => {
        alert('Copied');
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  const  getEmailText = () => {
    const text = "This is the default email text";
    setEmailText(text);
  }

  return (
    <div>
    <header  className='header'>
         <div style={{ marginLeft: '10px' }}>
        <FiHome size="24px" color='black'/>
      </div>
      <div>
        <FiUser size="24px" color='black' />
        </div>
        <div>
        <p style={{ margin: '0', fontWeight: 'bold', color:'black' }}>{user.username}</p>
        <p style={{ margin: '0', fontSize: '14px', color:'black' }}>{user.email}</p>
        </div>
    </header>
<div>
    {accounts.length === 0 && <img className='bg-image' src={"logo_large.png"} />}
      <h1 className='subject'>iReach</h1>

      <form onSubmit={handleSubmit}>
        <div className='flexDiv'/>
        <input
          type="text"
          autoFocus
          value={searchQuery}
          onChange={handleChange}
          placeholder="Enter plot here..."
        />
        <button className="submit-button" disabled={searchQuery.trim() === ''} onClick={()=>handleSubmit('standard')}>
          Standard Search
        </button>
        <button className="submit-button" disabled={searchQuery.trim() === ''} onClick={()=>handleSubmit('semantic')}>
          Semantic Search
        </button>
        <div className='flexDiv'/>
      </form>
      <div className="accounts">
        {accounts.map((account) => (
          <div key={account._id} className="account">
            <div className='rating'>
              <h2 className='title'>{account.title}</h2>
              <p>{(account.imdb || { rating: 0 }).rating || "N/A"}</p>
            </div>
            <h4 className='year'>{account.year || 'N/A'} | {(account.countries || ["N/A"])[0]} | {(account.languages || ["N/A"])[0]}</h4>
            <h5><em>Search score: {account.score}</em></h5>
            <p className='plot'>{account.fullplot || account.plot}</p>
            <img src={account.poster || "https://as1.ftcdn.net/v2/jpg/03/95/42/94/1000_F_395429472_LNyOoV7eRXm76HIIBBHOciyHEtiwS1Ed.jpg"} alt={`${account.title} Poster`} onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "https://as1.ftcdn.net/v2/jpg/03/95/42/94/1000_F_395429472_LNyOoV7eRXm76HIIBBHOciyHEtiwS1Ed.jpg";
            }} />
          </div>
        ))}
      </div>
      <div>
      <form onSubmit={generateEmail}>
        <div className='flexDiv'/>
        <input
          type="text"
          autoFocus
          value={promptText}
          onChange={handlePromptChange}
          placeholder="Enter email generation prompt here..."
        />
        <button className="submit-button" disabled={promptText.trim() === ''} onClick={()=>generateEmail()}>
          Generate Email <RiMailLine/>
        </button>
        <div className='flexDiv'/>
      </form>
      
      <div style={{ position: 'relative', width: '600px', margin: '20px auto' }}>
      <div style={{ border: '1px solid #ccc', padding: '10px', maxWidth: '600px', margin: '20px auto', height: '300px' }}>
      <p>{emailText}</p>
     
      <button className='copyText'
        onClick={copyText}   
      >
       Copy Email <FiCopy style={{color:'white', size: '1.5em'}} /> 
      </button>
      </div>
    </div>
    </div>
    </div>
    <div className='powered'>
        <div className='flexDiv'></div>
        <img height={24} src="/mongo.png"></img>
        <a className='powered-text' href="https://www.mongodb.com/products/platform/atlas-vector-search"><em>Powered by MongoDB Atlas Vector Search</em></a>
        <div className='flexDiv'></div>
      </div>
    </div>
  );
};

export default IReachApp;
