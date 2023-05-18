import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [chat, setChat] = useState([]);
  const [title, setTitle] = useState("");
  const [msgs, setMsgs] = useState({}) 
  const test = [{title: [{role: "", content: ""}]}]

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setTitle("");
  };

  const handleClick = (uniqueTitle) => {
    setTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({ role: "user", content: value }),
      // body: JSON.stringify({ message: value }),
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
      console.log(data)
      setMessage(data.choices[0].message);
    } catch (e) {
      console.error(e);
    }
  };

  // useEffect(() => {
  //   console.log(title, value, message);
  //   if (!title && value && message) {
  //     setTitle(value);
  //   }
  //   if (title && value && message) {
  //     setChat((chat) => [
  //       ...chat,
  //       {
  //         title: title,
  //         role: "user",
  //         content: value,
  //       },
  //       {
  //         title: title,
  //         role: message.role,
  //         content: message.content,
  //       },
  //     ]);
  //   }
  // }, [message, title]);

  // console.log(chat);

  const currentChat = chat.filter((chat) => chat.title === title);
  const uniqueTitles = Array.from(new Set(chat.map((chat) => chat.title)));
  // console.log(uniqueTitles);

  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Experimental</p>
        </nav>
      </section>
      <section className="main">
        {/* <h1>API_GPT</h1> */}
        <h1>{title || "API_GPT"}</h1>
        <ul className="feed">
          {currentChat?.map((message, index) => (
            <li key={index}>
              <p className="role">{message.role}</p>
              <p>{message.content}</p>
            </li>
          ))}
        </ul>
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
      </section>
    </div>
  );
}

export default App;
