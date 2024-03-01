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
    AccountName: "No account to show",
    UseCaseDescription: "",
    AnnualRunRate: 0,
    Industry: ""
  };

  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("Vector");
  const [showOptions, setShowOptions] = useState(false);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e, mode) => {
    e.preventDefault();
    setAccounts([]);

    fetchAccounts(mode);
  };

  const fetchAccounts = async (mode) => {
    try {
      const response = await fetch(
        `https://ap-south-1.aws.data.mongodb-api.com/app/ireach-dodfh/endpoint/${mode=='semantic'? 'semanticSearch':'dynamicSearch'}?s=${encodeURIComponent(searchQuery)}`
      );

      const similarAccounts = (await response.json()).results;

      if (Array.isArray(similarAccounts)) {
        if (similarAccounts.length > 0) {
          setAccounts(similarAccounts);
        }
        else {
          dummyAccount.usecaseDesc = 'Try again with a different search query';
          setAccounts([dummyAccount]);
        }
      }
      else {
        dummyAccount.usecaseDesc = 'This could be due to exceeded rate limit. Please try again after some time.';
        setAccounts([dummyAccount]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
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
        <input
          type="text"
          autoFocus
          value={searchQuery}
          onChange={handleChange}
          placeholder="Enter account name or query here..."
        />
        <button className="submit-button" disabled={searchQuery.trim() === ''} onClick={(e) => handleSubmit(e, 'standard')}>
          Standard Search
        </button>
        <button className="submit-button" disabled={searchQuery.trim() === ''} onClick={(e) => handleSubmit(e, 'semantic')}>
          Semantic Search
        </button>
        <div className='flexDiv' />
      </form>
      <div className="accounts">
        {accounts.map((account) => (
          <div key={account._id} className="account">
            <h2 className='accountName'>{account.AccountName}</h2>
            <h4 className='industry'>{account.Industry}</h4>
            <h5><em>Estimated Annual Run Rate: {account.AnnualRunRate}</em></h5>
            <p className='usecaseDesc'>{account.UseCaseDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IReachApp;
