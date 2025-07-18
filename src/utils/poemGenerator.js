export async function generateMotivation(text) {
  try {
    const response = await fetch("http://127.0.0.1:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    });

    if (!response.ok) {
      throw new Error("Motivation generation failed");
    }

    const data = await response.json();
    return data.sentence;  // Change this based on your backend response
  } catch (error) {
    console.error("Motivation generation error:", error);
    throw error;
  }
}

