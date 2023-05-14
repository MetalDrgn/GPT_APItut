import './App.css';

function App() {
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
              <input type="text" />
              <div id="submit">{'>'}</div>
            </div>
            <p className="info">
              Chat GPT 3.5 using API
            </p>
          </div>
        </ul>
      </section>
    </div>
  );
}

export default App;
