import './App.css';

import React, { useState } from "react";

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

  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSelect = (accountId) => {
    setSelectedAccount(accountId);
  }

  const handleSubmit = (e, mode) => {
    e.preventDefault();
    setAccounts([]);
    setSuggestions([]);

    fetchAccounts(mode);
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

  return (
    <div>
      {accounts.length === 0 && <img className='bg-image' src={"logo_large.png"} />}
      <div className='powered'>
        <div className='flexDiv'></div>
        <img height={24} src="/mongo.png"></img>
        <a className='powered-text' href="https://www.mongodb.com/products/platform/atlas-vector-search"><em>Powered by MongoDB Atlas Vector Search</em></a>
        <div className='flexDiv'></div>
      </div>
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
    </div>
  );
};

export default IReachApp;
