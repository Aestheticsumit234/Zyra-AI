import axios from "axios";
export const askOpenRouter = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid messages array provided to OpenRouter");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI response is empty!");
    }

    return content;
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    console.log("OpenRouter Error: ", errorMessage);
    throw new Error(errorMessage);
  }
};
