export async function generatePoem(text) {
  try {
    const response = await fetch("http://127.0.0.1:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }), // ✅ MAKE SURE it's an object with key "text"
    });

    if (!response.ok) {
      throw new Error("Poem generation failed");
    }

    const data = await response.json();
    return data.poem;
  } catch (error) {
    console.error("Poem generation error:", error);
    throw error;
  }
}
