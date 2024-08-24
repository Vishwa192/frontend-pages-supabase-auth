"use client";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/search.css";
import axios from "axios";

interface City {
  id: number;
  name: string;
  country: string;
  countryCode: string;
}

export default function Search() {
  const [result, setResult] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const options = {
        method: "GET",
        url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        params: {
          namePrefix: query,
          offset: (page - 1) * limit,
          limit,
        },
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          "x-rapidapi-host": process.env.NEXT_PUBLIC_RAPIDAPI_HOST,
        },
      };
      const response = await axios.request(options);
      setResult(response.data.data as City[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      fetchData();
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, page, limit]);

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = Number(e.target.value);
    if (newLimit > 10) {
      alert("Limit cannot exceed 10");
      setLimit(10);
    } else if (newLimit < 1) {
      setLimit(1);
    } else {
      setLimit(newLimit);
    }
  };

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        searchBoxRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  return (
    <main className="search-main">
      <div className="search-container">
        <div className="search-input-container">
          <input
            id="search-box"
            type="text"
            className="search-input"
            placeholder="Search Places"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={searchBoxRef}
          />
          <button className="search-button" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <>
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Place Name</th>
                <th>Country</th>
              </tr>
            </thead>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <tbody>
                {result.length === 0 ? (
                  <tr>
                    <td colSpan={3}>No results found</td>
                  </tr>
                ) : (
                  result.map((city, index) => (
                    <tr key={city.id}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{city.name}</td>
                      <td>
                        {city.country}
                        <img
                          src={`https://flagsapi.com/${city.countryCode}/flat/32.png`}
                          alt={`${city.country} flag`}
                          style={{ width: 32, height: 31, marginLeft: 8 }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
          <div className="pagination-container">
            <button
              className="previous-button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              PREVIOUS
            </button>
            <button
              className="next-button"
              onClick={() => handlePageChange(page + 1)}
              disabled={result.length < limit}
            >
              NEXT
            </button>
            <div className="limit-input-container">
              <label>Results per page:</label>
              <input
                type="number"
                value={limit}
                onChange={handleLimitChange}
                min="1"
                max="10"
                className="limit-input"
                style={{ marginLeft: "10px" }}
              />
            </div>
          </div>
        </>
      </div>
    </main>
  );
}
