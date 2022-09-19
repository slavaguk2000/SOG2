import './App.css';
import {useState} from "react";
import {useQuery} from "@apollo/client";
import {search} from "./utils/gql/queries";
import { v4 } from 'uuid';

function App() {
  const [searchPattern, setSearchPattern] = useState('бегущий');
  const { data } = useQuery(search, {
    variables: {
        searchPattern,
    },
    fetchPolicy: "cache-first",
  })

  return (
    <div className="App">
      <div>
          <input value={searchPattern} onChange={({ target }) => setSearchPattern(target.value)}/>
      </div>
      <div style={{
        marginTop: '50px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {data?.search.map(({ content }) => (<div style={{ margin: '10px', border: '3px solid black', borderRadius: '5px'}} key={v4()}>{content}</div>))}
      </div>
    </div>
  );
}

export default App;
