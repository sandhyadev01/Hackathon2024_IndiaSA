import './App.css';

import React, { useState } from "react";

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

  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [selectedOption, setSelectedOption] = useState("Vector");
  const [showOptions, setShowOptions] = useState(false);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
  };

  const handleDropdownToggle = (e) => {
    e.preventDefault();
    setShowOptions((prevShow) => !prevShow);
  };


  const handleSubmit = (e) => {
    setAccounts([]);
    e.preventDefault();
    fetchAccounts();
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          autoFocus
          value={searchQuery}
          onChange={handleChange}
          placeholder="Enter plot here..."
        />
        <div className="dropdown">
          <button className="dropdown-button submit-button" disabled={searchQuery.trim() === '' || (selectedOption === "Vector" && apiKey.trim() === '')} type="submit">
            {selectedOption === "Standard" ? "Standard Search" : "Vector Search"}
          </button>
          <button className="dropdown-button arrow" onClick={handleDropdownToggle}>▼</button>
          {showOptions && (
            <div className="dropdown-content">
              <button onClick={() => handleOptionChange("Standard")}>Standard Search</button>
              <button onClick={() => handleOptionChange("Vector")}>Vector Search</button>
            </div>
          )}
        </div>
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
    </div>
  );
};

export default IReachApp;
