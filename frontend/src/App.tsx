import { useEffect, useState } from "react";

function App() {
  const [hello, setHello] = useState<any>(null);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<WebSocket>();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/hello");
      const ws = new WebSocket("ws://localhost:3000/ws");

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.text();
      console.log(data);

      setHello(data);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setWs(ws);
      };

      ws.onmessage = (event) => {
        setMessages((prev) => [...prev, event.data]);
      };
    })();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Ripress + Wynd + React minimal demo</h1>
      <div>
        <h2>/hello</h2>
        <pre>{hello ? JSON.stringify(hello, null, 2) : "Loading..."}</pre>
      </div>
      <div>
        <h2>Websocket</h2>
        <input
          type="text"
          placeholder="Type something..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => ws?.send(input)}>Send</button>

        <p>Messages:</p>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
