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
  const [showOptions, setShowOptions] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [autocompleteTimeout, setAutocompleteTimeout] = useState(0);
  const [isPromtTextBarVisible, setIsPromptTextBarVisible] = useState(false);


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

  const handleSelect = (accountId) => {
    setSelectedAccount(accountId);
    setIsPromptTextBarVisible(true);

  }

  const handleSubmit = (e, mode) => {
    e.preventDefault();
    setAccounts([]);
    setSuggestions([]);

    fetchAccounts(mode);
  };


  const generateEmail = (e) => {
    e.preventDefault();
    setEmailText('DummyData');
    getEmailText(promptText);
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


  async function fetchGeneratedEmail(promptText) {

    try {
      const response = await fetch(
        `https://ap-south-1.aws.data.mongodb-api.com/app/ireach-dodfh/endpoint/`
      );

      const emailText = (await response.json()).results;

      if (emailText) {
        return ({ results: emailText, success: true });
      }
      else {
        emailText = 'Try again with a different search query';
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
        console.log("Text copied!");
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  const getEmailText = async (promptText) => {
    const { result, success } = await fetchGeneratedEmail(promptText);
    if (success) {
      setEmailText(result);
    }
    else {
      const text = "Try again with a different search query";
      setEmailText(text);
    }


  }

  return (
    <div>
      <header className='header'>
        <div style={{ marginLeft: '10px' }}>
          <FiHome size="24px" color='black' />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
          <FiUser size="30px" color='black' marginRight='15px' />
          <div>
            <p style={{ marginRight: '20px', fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>{user.username}</p>
            <p style={{ margin: '0', fontSize: '14px', color: 'black' }}>{user.email}</p>
          </div>
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
      {isPromtTextBarVisible && (<div className='generate-email'>
        <div className='text-area-email'>
          <textarea className='prompt-text-area'
            type="text"
            autoFocus
            value={promptText}
            onChange={handlePromptChange}
            placeholder="Enter email generation prompt here..."
          />
        </div>
        <button className='generate-email-button' disabled={promptText.trim() === ''} onClick={(e) => generateEmail(e)}>
          Generate Email <RiMailLine />
        </button>

        <div className='email-text'>
          {emailText}

          <button className='copy-text'
            onClick={copyText}
          >
            Copy Email <FiCopy style={{ color: 'white', size: '1.5em' }} />
          </button>
        </div>
      </div>
      )}
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
