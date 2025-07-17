import React, { useState, useEffect } from "react";
import { generatePoem } from "./utils/poemGenerator";

export default function PoemInput() {
  const [input, setInput] = useState("");
  const [poem, setPoem] = useState("");
  const [voices, setVoices] = useState([]);
  const [isVoiceReady, setIsVoiceReady] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const loaded = window.speechSynthesis.getVoices();
      console.log("Voices loaded:", loaded.map((v) => v.name));
      if (loaded.length > 0) {
        setVoices(loaded);
        setIsVoiceReady(true);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPoem("Generating...");
    const generated = await generatePoem(input);
    setPoem(generated);
  };

  const speakPoem = () => {
    if (!poem) return;

    const utterance = new SpeechSynthesisUtterance(poem);

    // Find a soft/female voice
    const preferredVoice =
      voices.find((v) => /female|zira|karen|Google US English/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("english")) ||
      voices[0];

    if (preferredVoice) {
      console.log("Using voice:", preferredVoice.name);
      utterance.voice = preferredVoice;
    }

    // Soothing tone
    utterance.pitch = 1.4;
    utterance.rate = 0.95;
    utterance.volume = 1;

    // Speak
    window.speechSynthesis.cancel(); // Cancel any previous
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">✨ Echoes of You</h1>
      <p className="text-muted">Describe your day to receive a personalized poem.</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="form-control mb-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. I had a long day, missed my train"
        />
        <button className="btn btn-primary" type="submit">
          Generate Poem
        </button>
      </form>

      {poem && (
        <div className="mt-5">
          <h3 className="mb-3">📜 Your Poem</h3>
          <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{poem}</pre>
          <button className="btn btn-outline-success mt-3" onClick={speakPoem}>
            🔊 Play Voice
          </button>
        </div>
      )}
    </div>
  );
}
