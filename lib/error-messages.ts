export interface FriendlyError {
  message: string;
  suggestion?: string;
  isRetryable: boolean;
}

/**
 * Maps OpenAI API errors to user-friendly messages with actionable suggestions
 */
export function mapOpenAIError(errorText: string): FriendlyError {
  const lowerError = errorText.toLowerCase();

  if (
    lowerError.includes("insufficient_quota") ||
    lowerError.includes("billing") ||
    lowerError.includes("payment")
  ) {
    return {
      message: "OpenAI rejected this request due to quota limits.",
      suggestion: "Please verify your OpenAI billing status or try again later.",
      isRetryable: false,
    };
  }

  if (
    lowerError.includes("rate limit") ||
    lowerError.includes("requests") ||
    lowerError.includes("429")
  ) {
    return {
      message: "OpenAI is receiving too many requests right now.",
      suggestion: "Wait a few seconds before trying again.",
      isRetryable: true,
    };
  }

  if (
    lowerError.includes("content policy") ||
    lowerError.includes("safety") ||
    lowerError.includes("disallowed")
  ) {
    return {
      message: "The prompt violates OpenAI content policies.",
      suggestion: "Adjust your prompt to meet the content guidelines and try again.",
      isRetryable: false,
    };
  }

  if (
    lowerError.includes("timeout") ||
    lowerError.includes("network") ||
    lowerError.includes("fetch failed")
  ) {
    return {
      message: "We lost the connection to OpenAI mid-request.",
      suggestion: "Check your network and retry in a moment.",
      isRetryable: true,
    };
  }

  if (
    lowerError.includes("400") ||
    lowerError.includes("bad request") ||
    lowerError.includes("invalid")
  ) {
    return {
      message: "OpenAI could not process this prompt.",
      suggestion: "Double-check your prompt formatting and supplied options.",
      isRetryable: false,
    };
  }

  if (
    lowerError.includes("500") ||
    lowerError.includes("502") ||
    lowerError.includes("503")
  ) {
    return {
      message: "OpenAI is temporarily unavailable.",
      suggestion: "Try again shortly.",
      isRetryable: true,
    };
  }

  return {
    message: "OpenAI failed to generate an image.",
    suggestion: "Please try again in a moment.",
    isRetryable: true,
  };
}

/**
 * Maps technical API errors to user-friendly messages with actionable suggestions
 */
export function mapGeminiError(errorText: string): FriendlyError {
  const lowerError = errorText.toLowerCase();

  // Rate limit / Quota errors
  if (
    lowerError.includes("rate limit") ||
    lowerError.includes("quota") ||
    lowerError.includes("429") ||
    lowerError.includes("resource_exhausted")
  ) {
    return {
      message: "We're experiencing high demand right now.",
      suggestion: "Please wait a moment and try again in a few seconds.",
      isRetryable: true,
    };
  }

  // Content policy violations
  if (
    lowerError.includes("content policy") ||
    lowerError.includes("safety") ||
    lowerError.includes("blocked") ||
    lowerError.includes("inappropriate")
  ) {
    return {
      message: "Unable to generate this portrait due to content guidelines.",
      suggestion:
        "Try adjusting your prompt or using different reference images.",
      isRetryable: false,
    };
  }

  // Network / Timeout errors
  if (
    lowerError.includes("timeout") ||
    lowerError.includes("network") ||
    lowerError.includes("econnrefused") ||
    lowerError.includes("fetch failed")
  ) {
    return {
      message: "Connection issue detected.",
      suggestion: "Please check your internet connection and try again.",
      isRetryable: true,
    };
  }

  // Invalid input / Bad request
  if (
    lowerError.includes("invalid") ||
    lowerError.includes("bad request") ||
    lowerError.includes("400")
  ) {
    return {
      message: "There was an issue with your request.",
      suggestion:
        "Please check your images are valid and under 5MB each, then try again.",
      isRetryable: false,
    };
  }

  // Server errors
  if (
    lowerError.includes("500") ||
    lowerError.includes("502") ||
    lowerError.includes("503") ||
    lowerError.includes("internal server error")
  ) {
    return {
      message: "Our image generation service is temporarily unavailable.",
      suggestion: "Please try again in a few moments.",
      isRetryable: true,
    };
  }

  // No image returned
  if (lowerError.includes("no image returned")) {
    return {
      message: "The AI couldn't generate an image from your request.",
      suggestion:
        "Try using clearer reference images or adjusting your instructions.",
      isRetryable: true,
    };
  }

  // Generic fallback
  return {
    message: "Something went wrong while creating your portrait.",
    suggestion: "Please try again in a moment. If the issue persists, contact support.",
    isRetryable: true,
  };
}

/**
 * Maps authentication errors to user-friendly messages
 */
export function mapAuthError(): FriendlyError {
  return {
    message: "Please sign in to generate portraits.",
    suggestion: "Sign in or create an account to get started.",
    isRetryable: false,
  };
}

/**
 * Maps credit errors to user-friendly messages
 */
export function mapCreditsError(): FriendlyError {
  return {
    message: "You don't have enough credits to generate this portrait.",
    suggestion: "Purchase more credits to continue creating amazing portraits.",
    isRetryable: false,
  };
}
