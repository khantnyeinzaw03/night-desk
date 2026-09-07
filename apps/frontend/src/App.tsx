import { useState, type SubmitEvent } from "react";
import "./App.css";

type ScrapeResult = Record<string, unknown>;

const FEATURED_KEYS = [
  "title",
  "company",
  "location",
  "workType",
  "salary",
  "skills",
  "description",
  "url",
] as const;

const HIDDEN_KEYS = new Set([
  "_id",
  "__v",
  "id",
  "createdAt",
  "updatedAt",
  "message",
]);

const WORK_TYPE_LABELS: Record<string, string> = {
  remote: "Remote",
  onsite: "On-site",
  hybrid: "Hybrid",
};

function asText(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed !== "null" ? trimmed : null;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return null;
}

function skillList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asText(item))
      .filter((item): item is string => item !== null);
  }
  const text = asText(value);
  if (!text) {
    return [];
  }
  return text
    .split(/[,|;/•·]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function asJob(body: unknown): ScrapeResult | null {
  if (!body || typeof body !== "object") {
    return null;
  }
  if ("job" in body && body.job && typeof body.job === "object") {
    return body.job as ScrapeResult;
  }
  return body as ScrapeResult;
}

function workTypeLabel(value: unknown): string | null {
  const key = asText(value)?.toLowerCase();
  if (!key) {
    return null;
  }
  return WORK_TYPE_LABELS[key] ?? asText(value);
}

function salaryFigure(value: unknown): string | null {
  const asString = asText(value);
  if (asString) {
    return asString;
  }
  if (!value || typeof value !== "object") {
    return null;
  }

  const { min, max, currency } = value as {
    min?: unknown;
    max?: unknown;
    currency?: unknown;
  };
  const format = (amount: unknown) =>
    typeof amount === "number" && Number.isFinite(amount)
      ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(amount)
      : null;

  const minText = format(min);
  const maxText = format(max);
  if (!minText && !maxText) {
    return null;
  }

  const range =
    minText && maxText && minText !== maxText ? `${minText}–${maxText}` : (minText ?? maxText);
  const currencyText = asText(currency);
  return currencyText ? `${currencyText} ${range}` : range;
}

function extraEntries(result: ScrapeResult): [string, string][] {
  return Object.entries(result)
    .filter(
      ([key]) =>
        !FEATURED_KEYS.includes(key as (typeof FEATURED_KEYS)[number]) &&
        !HIDDEN_KEYS.has(key),
    )
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        const joined = value.map((item) => asText(item)).filter(Boolean).join(", ");
        return [key, joined] as [string, string];
      }
      const text = asText(value);
      return [key, text ?? ""] as [string, string];
    })
    .filter(([, value]) => value.length > 0);
}

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

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

      setResult(asJob(body));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) {
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const title = asText(result?.title);
  const company = asText(result?.company);
  const location = asText(result?.location);
  const workType = workTypeLabel(result?.workType);
  const salary = salaryFigure(result?.salary);
  const skills = skillList(result?.skills);
  const description = asText(result?.description);
  const sourceUrl = asText(result?.url);
  const extras = result ? extraEntries(result) : [];
  const hasClipping = Boolean(
    result &&
      (title ||
        company ||
        location ||
        workType ||
        salary ||
        skills.length ||
        description ||
        extras.length),
  );

  return (
    <div className="desk">
      <header className="masthead">
        <p className="kicker">Vol. 01 · Night desk</p>
        <h1>The Pull</h1>
        <p className="lede">
          Paste a listing. We typeset the crawl as a classified clipping.
        </p>
      </header>

      <div className="workbench">
        <section className="slip" aria-labelledby="assignment-heading">
          <p className="slip-label" id="assignment-heading">
            Assignment
          </p>
          <form onSubmit={onSubmit} aria-busy={loading}>
            <label htmlFor="url">Source URL</label>
            <input
              id="url"
              name="url"
              type="url"
              required
              autoComplete="url"
              placeholder="https://example.com/jobs/role"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Pulling copy…" : "Pull listing"}
            </button>
          </form>
          <p className="slip-note">Ink dries on the right. One URL, one want-ad.</p>
        </section>

        <section
          className={`clipping${loading ? " is-scanning" : ""}`}
          aria-live="polite"
          aria-label="Crawl result"
        >
          <div className="clipping-pin" aria-hidden="true" />
          {loading ? (
            <p className="status" role="status">
              Setting type…
            </p>
          ) : null}

          {error ? (
            <p className="proof" role="alert">
              <span className="proof-mark">stet</span>
              {error}
            </p>
          ) : null}

          {hasClipping && result ? (
            <article className="want-ad">
              <div className="want-ad-top">
                <p className="edition">Wanted · pulled from the live web</p>
                <button type="button" className="copy" onClick={copyResult}>
                  {copied ? "Copied" : "Copy JSON"}
                </button>
              </div>
              {title ? <h2>{title}</h2> : <h2 className="untitled">Untitled listing</h2>}
              <p className="dateline">
                {company ? <span>{company}</span> : null}
                {location ? <span>{location}</span> : null}
                {workType ? <span className="work-type">{workType}</span> : null}
              </p>
              {salary ? (
                <p className="salary">
                  <span className="salary-label">Comp</span>
                  <span className="salary-figure">{salary}</span>
                </p>
              ) : null}
              {skills.length > 0 ? (
                <ul className="slugs" aria-label="Skills">
                  {skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              ) : null}
              {description ? (
                <div className="notice">
                  <p className="notice-label">Notice</p>
                  <p className="notice-copy">{description}</p>
                </div>
              ) : null}
              {sourceUrl ? (
                <p className="source">
                  <a href={sourceUrl} target="_blank" rel="noreferrer">
                    {sourceUrl}
                  </a>
                </p>
              ) : null}
              {extras.length > 0 ? (
                <dl className="extras">
                  {extras.map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </article>
          ) : null}

          {!loading && !error && !hasClipping ? (
            <div className="awaiting">
              <p className="awaiting-rule">No copy on the hook</p>
              <p>
                Send a job URL. Title, shop, town, work type, pay, skills, and
                notice land here as a clipping.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
