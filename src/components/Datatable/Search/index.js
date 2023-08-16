import React, { useState } from "react";

// eslint-disable-next-line react/prop-types
const Search = ({ onSearch }) => {
    const [search, setSearch] = useState("")
    const onInputChange = value => {
        setSearch(value);
        onSearch(value);
    };
    return (
      <div className="search-box d-inline-block">
        <div className="position-relative"><label htmlFor="search-bar-0" className="search-label"><span id="search-bar-0-label" className="sr-only">Search this table</span><input
          id="search-bar-0" type="text" aria-labelledby="search-bar-0-label" className="form-control " placeholder="Search"
          value={search} onChange={e => onInputChange(e.target.value)}/></label><i className="bx bx-search-alt search-icon"></i></div>
      </div>
    );
};

export default Search;
