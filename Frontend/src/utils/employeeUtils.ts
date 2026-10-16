export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response as {
      data?: { message?: string };
    };
    if (response.data?.message) return response.data.message;
  }

  if (error instanceof Error) {
    if (error.message === "Network Error") {
      return "Unable to connect to the API. Check that your backend is running and CORS is enabled.";
    }
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function isAddedWithinLast30Days(value?: string): boolean {
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  const now = Date.now();
  return Number.isFinite(timestamp) &&
    timestamp <= now &&
    now - timestamp < 30 * 24 * 60 * 60 * 1000;
}
