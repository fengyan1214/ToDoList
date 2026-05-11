import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  return <h1>{message}</h1>;
}

export default App;
