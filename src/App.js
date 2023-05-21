import "./App.css";
import { useState, useEffect } from "react";

function App() {
  // Value of what's in the input box.
  const [value, setValue] = useState("");
  // Stores the messages - old.
  const [message, setMessage] = useState(null);

  const [chat, setChat] = useState([]);
  // Sets the title of the chat. Created from first prompt submitted.
  const [title, setTitle] = useState("");
  // New chat storage
  const [msgs, setMsgs] = useState({});
  // Temp test
  const test = { title: [{ role: "", content: "" }] };

  // Start new chat
  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setTitle("");
  };

  // Unique titles on the left.
  const handleClick = (uniqueTitle) => {
    setTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify([{ role: "user", content: value }]),
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
      if (data['error']) {
        console.error(data['error'].message)
        return
      }
      if (!title && value) {
        setTitle(value)
      }
      console.log(data);

      // Trying to create Object with titles with array of messages for each title.
      // setMsgs((value, data) => {
      let runonce = false
      setMsgs((m) => {
        if (runonce) {
          runonce = false
          return m
        } else {runonce = true}
        let temp = title ? title : value
        if (m[temp]) {
          m[temp] = [...m[temp],data.choices[0].message]
          return m
          // return m[temp].push(data.choices[0].message)
        } else {
          return Object.assign(m, {[temp]: [data.choices[0].message]})
        }
      })

        // if (chat[Object.keys(e)[0]]) {
        //   chat[Object.keys(e)[0]] = [...chat[Object.keys(chat)[0]], ...e[Object.keys(e)[0]]] 
        // } else {
        //   chat = Object.assign(chat,e)
        // }
        // return {...title: [data.choices[0].message, ...message?.title]}


      setMessage(data.choices[0].message);
    } catch (e) {
      console.error(e);
    }
  };

  // ***Removing unneeded useEffect
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

  // Obsolete get of chats under specific title.
  const currentChat = chat.filter((chat) => chat.title === title);

  // Obsolete get of unique titles.
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
