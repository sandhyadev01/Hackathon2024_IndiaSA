import './App.css';

import React, { useState } from "react";
import { RiMailLine } from 'react-icons/ri';
import { FiCopy } from 'react-icons/fi';
import { FiUser, FiHome } from 'react-icons/fi';

const IReachApp = () => {
  /*
            UseCaseDescription: 1,
            AccountName: 1,
            Industry:1,
            AnnualRunRate: 1,
            AccountId: 1
  
  */

  const dummyAccount = {
    AccountName: "No accounts to show",
    UseCaseDescription: "",
    AnnualRunRate: 0,
    Industry: "",
    AccountId: ""
  };

  const user = {
    username: 'John Doe',
    email: 'john@example.com'
  };

  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("Vector");
  const [showOptions, setShowOptions] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [autocompleteTimeout, setAutocompleteTimeout] = useState(0);


  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    clearTimeout(autocompleteTimeout);

    if (e.target.value !== "") {
      setAutocompleteTimeout(setTimeout(async () => {
        const { results, success } = await searchAccounts('searchAutocomplete', e.target.value);

        if (success) {
          setSuggestions(results);
        }
      }, 100));
    }
  };

  const handlePromptChange = (e) => {
    setPromptText(e.target.value);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
  };

  const handleSelect = (accountId) => {
    setSelectedAccount(accountId);
  }

  const handleSubmit = (e, mode) => {
    e.preventDefault();
    setAccounts([]);
    setSuggestions([]);

    fetchAccounts(mode);
  };


  const generateEmail = (e) => {
    e.preventDefault();
    setEmailText("");
    getEmailText();
  };

  async function searchAccounts(mode, searchQuery) {

    try {
      const response = await fetch(
        `https://ap-south-1.aws.data.mongodb-api.com/app/ireach-dodfh/endpoint/${mode}?s=${encodeURIComponent(searchQuery)}`
      );

      const similarAccounts = (await response.json()).results;

      if (Array.isArray(similarAccounts)) {
        if (similarAccounts.length > 0) {
          return ({ results: similarAccounts, success: true });
        }
        else {
          dummyAccount.usecaseDesc = 'Try again with a different search query';
          return ({ success: false });
        }
      }
      else {
        dummyAccount.usecaseDesc = 'This could be due to exceeded rate limit. Please try again after some time.';
        return ({ success: false });
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  }

  const fetchAccounts = async (mode) => {
    const { results, success } = await searchAccounts(mode, searchQuery);

    if (success) {
      setAccounts(results);
      setSelectedAccount(results[0].AccountId);
    }
    else {
      setAccounts([dummyAccount]);
      setSelectedAccount(dummyAccount.AccountId);
    }
  };


  const copyText = () => {
    navigator.clipboard.writeText(emailText)
      .then(() => {
        alert('Copied: ' + emailText);
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  const  getEmailText = () => {
    const text = "This is the default email text";
    setEmailText(promptText);
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

    {accounts.length === 0 && <img className='bg-image' src={"logo_large.png"} />}
      <h1 className='subject'>iReach</h1>
      <form>
        <div className='flexDiv' />
        <div>
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={handleChange}
            placeholder="Enter account name or query here..."
          />
          {suggestions.length > 0 && searchQuery.length > 0 &&
            <ul>
              {suggestions.map(suggestion => (
                <li key={suggestion.AccountId} onClick={() => { setSelectedAccount(suggestion.AccountId); setAccounts([suggestion]); setSearchQuery(suggestion.AccountName); setSuggestions([]) }}>
                  {suggestion.AccountName}
                </li>
              ))}
            </ul>}
        </div>
        <button className="submit-button" disabled={searchQuery.trim() === ''} onClick={(e) => handleSubmit(e, 'dynamicSearch')}>
          Standard Search
        </button>
        <button className="submit-button" disabled={searchQuery.trim() === ''} onClick={(e) => handleSubmit(e, 'semanticSearch')}>
          Semantic Search
        </button>
        <div className='flexDiv' />
      </form>
      <div className="accounts">
        {accounts.map((account) => (
          <div key={account.AccountId} className={"account" + (account.AccountId === selectedAccount && selectedAccount !== "" ? " selected" : "")} onClick={() => handleSelect(account.AccountId)}>
            <h2 className='accountName'>{account.AccountName}</h2>
            <h4 className='industry'>{account.Industry}</h4>
            {account.AnnualRunRate > 0 && <h5><em>Estimated Annual Run Rate: {account.AnnualRunRate}</em></h5>}
            <p className='usecaseDesc'>{account.UseCaseDescription}</p>
          </div>
        ))}
      </div>
      <div>
      <form >
        <div className='flexDiv'/>
        <input
          type="text"
          autoFocus
          value={promptText}
          onChange={handlePromptChange}
          placeholder="Enter email generation prompt here..."
        />
        <button className="submit-button" disabled={promptText.trim() === ''} onClick={(e)=>generateEmail(e)}>
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
