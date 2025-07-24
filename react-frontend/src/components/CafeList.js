import React, { useEffect, useState } from 'react';

const baseUrl = process.env.REACT_APP_ISLOCAL ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;

const CafeList = () => {
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await fetch(`${baseUrl}/cafes`);
        const data = await response.json();
        setCafes(data);
      } catch (error) {
        console.error('Error fetching cafes:', error);
      }
    };

    fetchCafes();
  }, []);

  return (
    <div>
      <h2>Cafes</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {cafes.map(cafe => (
            <tr key={cafe.id}>
              <td>{cafe.id}</td>
              <td>{cafe.name}</td>
              <td>{cafe.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CafeList;