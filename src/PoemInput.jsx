import React, { useState, useEffect } from "react";
import { generateMotivation } from "./utils/poemGenerator"; // updated import

export default function MotivationInput() {
  const [input, setInput] = useState("");
  const [sentence, setSentence] = useState("");
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
    setSentence("Generating...");
    const generated = await generateMotivation(input);
    setSentence(generated);
  };

  const speakSentence = () => {
    if (!sentence) return;

    const utterance = new SpeechSynthesisUtterance(sentence);

    const preferredVoice =
      voices.find((v) => /female|zira|karen|Google US English/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("english")) ||
      voices[0];

    if (preferredVoice) {
      console.log("Using voice:", preferredVoice.name);
      utterance.voice = preferredVoice;
    }

    utterance.pitch = 1.2;
    utterance.rate = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">🌟 Positive Echo</h1>
      <p className="text-muted">Describe your mood to receive a motivational thought.</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="form-control mb-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Feeling a bit stressed about work"
        />
        <button className="btn btn-primary" type="submit">
          Generate Motivation
        </button>
      </form>

      {sentence && (
        <div className="mt-5">
          <h3 className="mb-3">💡 Your Motivation</h3>
          <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{sentence}</pre>
          <button className="btn btn-outline-success mt-3" onClick={speakSentence}>
            🔊 Play Voice
          </button>
        </div>
      )}
    </div>
  );
}
