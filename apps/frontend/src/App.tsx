import { useState, type FormEvent } from "react";
import "./App.css";

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const body: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof body === "object" &&
          body !== null &&
          "error" in body &&
          typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : response.statusText;
        setError(message);
        return;
      }

      setResult(JSON.stringify(body, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Firecrawl scrape</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="url">URL</label>
        <input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://example.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Scraping…" : "Scrape"}
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {result ? <pre>{result}</pre> : null}
    </main>
  );
}
