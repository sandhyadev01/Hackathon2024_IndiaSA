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
    username: 'Smith John',
    email: 'smith.john@mongodb.com'
  };

  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [promptText, setPromptText] = useState("I am a <your role>, please generate a relevant email.");
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

  const handleEmailChange = (e) => {
    setEmailText(e.target.value);
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
    getEmailText(promptText);
  };

  async function searchAccounts(mode, searchQuery) {
    try {
      if (mode !== "searchAutocomplete") {
        setShowLoader(true);
      }

      const response = await fetch(
        `https://ap-south-1.aws.data.mongodb-api.com/app/ireach-dodfh/endpoint/${mode}?s=${encodeURIComponent(searchQuery)}`
      );

      setShowLoader(false);

      const similarAccounts = (await response.json()).results;

      if (Array.isArray(similarAccounts)) {
        if (similarAccounts.length > 0 || mode === "searchAutocomplete") {
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
      setShowLoader(true);

      const response = await fetch(
        `https://ap-south-1.aws.data.mongodb-api.com/app/ireach-dodfh/endpoint/generateEmail?accountId=${selectedAccount}&prompt=${promptText}`
      );

      setShowLoader(false);

      const emailText = (await response.json()).results;

      if (emailText) {
        return ({ result: emailText, success: true });
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
    <div className="motherOfAll">
      <div className='mainForm'>
        {accounts.length === 0 && <img className='bg-image' src={"logo_large.png"} />}
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
              {account.AnnualRunRate > 0 && <h5><em>Estimated Annual Run Rate: ${account.AnnualRunRate}</em></h5>}
              {account.ContactName && <h5>Contact: {`${account.ContactName} (${account.role})`}</h5>}
              <p className='usecaseDesc'>{account.UseCaseDescription}</p>
            </div>
          ))}
        </div>
        {selectedAccount !== "" && (<div className='generate-email'>
          <div className='text-area-email'>
            <textarea className='prompt-text-area'
              type="text"
              autoFocus
              value={promptText}
              onChange={handlePromptChange}
              placeholder="Enter email generation prompt here..."
            />
            <button className='generate-email-button' disabled={promptText.trim() === ''} onClick={(e) => generateEmail(e)}>
              Generate Email <RiMailLine />
            </button>
          </div>
          <div className='email-text'>
            <textarea className='prompt-text-area'
              type="text"
              autoFocus
              value={emailText}
              onChange={handleEmailChange}
            />

            <button className='generate-email-button' onClick={copyText}>
              Copy Email <FiCopy style={{ color: 'black', size: '1.5em' }} />
            </button>
          </div>
        </div>
        )}

        <div className='iframeParent'>
          <div className='flexDiv' />
          <iframe className='iframeCharts' src="https://charts.mongodb.com/charts-india-hack-omwcc/embed/dashboards?id=cc99c69b-ce83-49cb-ab9e-11ae23160615&theme=dark&showTitleAndDesc=true&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed" />
          <div className='flexDiv' />
        </div>

        <header className='header'>
          <div style={{ marginLeft: 20, color: 'black', fontSize: 22, fontWeight: 'bold' }}>
            iReach
          </div>
          <div className='flexDiv' />
          <div style={{ marginRight: 20, display: 'flex', color: 'black', textAlign: 'right' }}>
            <div>
              <p className='userName'>{user.username}</p>
              <p className='userEmail'>{user.email}</p>
            </div>
            <FiUser size="30px" color='black' className='userIcon' />
          </div>
        </header>

        <div className='loader' style={showLoader ? { display: 'block' } : { display: 'none' }}>
          <img src="https://media.tenor.com/t5DMW5PI8mgAAAAi/loading-green-loading.gif" height="100px" width="100px" />
        </div>

        <div className='powered'>
          <div className='flexDiv'></div>
          <img height={24} src="/mongo.png"></img>
          <a className='powered-text' href="https://www.mongodb.com/products/platform/atlas-vector-search"><em>Powered by MongoDB Atlas Vector Search</em></a>
          <div className='flexDiv'></div>
        </div>
      </div>
    </div>
  );
};

export default IReachApp;
