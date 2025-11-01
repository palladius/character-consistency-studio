// This file contains configuration for the application.
// Note: Pricing is for estimation purposes only and may not be exact.
// Please refer to the official Google Cloud pricing page for the most up-to-date information.
// Prices are per 1 million tokens.
// As of late 2024, Gemini 1.5 Flash (used for gemini-2.5-flash-image) is approximately:
// - $0.35 / 1M input tokens
// - $0.70 / 1M output tokens

export const TOKEN_COSTS = {
  // Cost for tokens sent TO the model (e.g., prompts)
  INPUT_PER_MILLION_USD: 0.35,
  // Cost for tokens received FROM the model (e.g., generated image data)
  OUTPUT_PER_MILLION_USD: 0.70,
};
