import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [chat, setChat] = useState([]);
  const [title, setTitle] = useState([]);

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      // console.log(data)
      setMessage(data.choices[0].message);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect( () => {
    console.log(title, value, message)
    if (!title && value && message) {
      setTitle(value)
    }
  }, [message, title]);

  return (
    <div className="App">
      <section className="side-bar">
        <button>+ New chat</button>
        <ul className="history">
          <li>ASD</li>
        </ul>
        <nav>
          <p>Experimental</p>
        </nav>
      </section>
      <section className="main">
        <h1>API_GPT</h1>
        <ul className="feed">
          <div className="bottom-section">
            <div className="input-container">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <div id="submit" onClick={getMessages}>
                {">"}
              </div>
            </div>
            <p className="info">Chat GPT 3.5 using API</p>
          </div>
        </ul>
      </section>
    </div>
  );
}

export default App;
