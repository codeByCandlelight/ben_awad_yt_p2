import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

// https://randomuser.me/api/?results-20

// type Person = any;
type Location = any;

const fetchData = () => {
  return axios
    .get('https://randomuser.me/api/?results-20')
    .then((res) => {
      const { results } = res.data;
      // console.log(results);
      return results;
    })
    .catch((error) => {
      console.error(error);
    });
};

const flattenLocations = (locations: Location[]) => {
  const location: string[] = locations[0];
  console.log(location);
  const flattenedLocationHeaders = extractObjectKeys(location);
  const data = [];
  for (const { street, coordinates, timezone, ...rest } of locations) {
    data.push({
      ...rest,
      number: street.number,
    });
  }

  console.log(flattenedLocationHeaders);
  return { headers: flattenedLocationHeaders, data };
};

const extractObjectKeys = (object: any) => {
  let objectKeys: string[] = [];
  Object.keys(object).forEach((objectKey) => {
    const value = object[objectKey];
    if (typeof value !== 'object') {
      objectKeys.push(objectKey);
    } else {
      objectKeys = [...objectKeys, ...extractObjectKeys(value)];
    }
  });

  return objectKeys;
};

export default function App() {
  const [people, setPeople] = useState([]);
  const [flattenedLocations, setFlattenedLocations] = useState<any[]>([]);

  useEffect(() => {
    fetchData().then((apiPeople) => {
      setPeople(apiPeople);
      setFlattenedLocations(
        flattenLocations(apiPeople.map(({ location }: object) => location))
      );
    });
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <table>
        <thead>
          <tr>
            {flattenedLocations.headers.map(
              (locationString: string, locationIdx: any) => (
                <th key={locationIdx}>{locationString}</th>
              )
            )}
          </tr>
        </thead>
      </table>
    </div>
  );
}
