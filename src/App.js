import "./App.css";
import { useState, useRef } from "react";
import {v4 as uuidv4} from 'uuid';

function App() {
  // Value of what's in the input box.
  const [value, setValue] = useState("");
  // Stores the messages - old.
  const [message, setMessage] = useState(null);
  // Stores chats - old.
  const [chat, setChat] = useState([]);
  // Sets the title of the chat - old.
  const [title, setTitle] = useState("");
  // New chat storage
  const [msgs, setMsgs] = useState({});
  // Id for chat sessions. Id.title for the chat title
  // const [id, setId] = useState(uuidv4())
  const [id, setId] = useState("")
  // creates a list of titles for history.
  const [uniqueTitles, setUniqueTitles] = useState([])
  // Temp test
  // const test = { title: [{ role: "", content: "" }] };

  // Start new chat
  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setTitle("");
    setId("")
  };

  // Unique titles on the left.
  const handleClick = (uniqueTitle) => {
    setTitle(uniqueTitle);
    setMessage(null);
    setValue("");
    setId(uniqueTitle)
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify(
        msgs[id] ? [...msgs[id].chat,{ role: "user", content: value }] : [{ role: "user", content: value }]
        ),
      // body: JSON.stringify([{ role: "user", content: value }]),
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
      let newId = uuidv4()
      if (!title && value) {
        setTitle(value)
        setId(newId)
      }
      console.log(data);
      
      let runonce = false
      // Trying to create Object with titles with array of messages for each title. Done.
      setMsgs((m) => {
        // make sure it only runs once. Ran into it running twice causing duplication.
        if (runonce) {
          runonce = false
          return m
        } else {runonce = true}

        // setup for object. 
        // ex {id1: {title: [{role: role1, content: message1}, {role: role2, content: message2}]}}
        // ex {id1: {title:title, chat:[{role: role1, content: message1}, {role: role2, content: message2}]}}
        // Can probably take out temp and just have it be ID since I added an ID to the initial state.
        let temp = id ? id : newId
        if (m[temp]) {
          m[temp].chat = [...m[temp].chat,{ role: "user", content: value },data.choices[0].message]
          // m[temp][title || value] = [...m[temp][title || value],{ role: "user", content: value },data.choices[0].message]
          return m
        } else {
          return Object.assign(m, {[temp]: {title:(title || value), chat:[{ role: "user", content: value },data.choices[0].message]}})
        }
      })
      // need this to list title names. Need to also change to object to get ID and name for list.
      setUniqueTitles(Array.from(Object.keys(msgs)));
      setMessage(data.choices[0].message);
    } catch (e) {
      console.error(e);
    }
  };

  // ***Removing unneeded useEffect. need to extract some functionality first
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
  // const currentChat = chat.filter((chat) => chat.title === title);
  const currentChat = msgs[id]?.chat;

  // Obsolete get of unique titles.
  // const uniqueTitles = Array.from(new Set(chat.map((chat) => chat.title)));
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
