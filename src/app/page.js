"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tone, setTone] = useState("friendly");

  async function sendMessage() {
    if (!message.trim()) return;

    setLoading(true);
    setError("");
    setReply("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setReply(data.reply);
    } catch (err) {
      setError("Failed to get response from AI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h1>AI Playground</h1>

      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        <option value="friendly">Friendly</option>
        <option value="professional">Professional</option>
        <option value="simple">Simple</option>
      </select>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        rows={4}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {reply && (
        <div style={{ marginTop: 20 }}>
          <strong>AI Reply:</strong>
          <p>{reply}</p>
        </div>
      )}
    </main>
  );
}
