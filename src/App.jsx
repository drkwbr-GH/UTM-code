import React, { useMemo, useState } from "react";

function appendUtm(baseUrl, params) {
  if (!baseUrl) return "";
  try {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    return "";
  }
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function App() {
  const [baseUrl, setBaseUrl] = useState("");
  const [campaign, setCampaign] = useState("");
  const [contentName, setContentName] = useState("");
  const [includeCampaign, setIncludeCampaign] = useState(true);

  const autoContentFromUrl = useMemo(() => {
    try {
      const url = new URL(baseUrl);
      const parts = url.pathname.split("/").filter(Boolean);
      const lastPart = parts[parts.length - 1] || "";
      return slugify(lastPart);
    } catch {
      return "";
    }
  }, [baseUrl]);

  const normalizedContent = useMemo(() => {
    if (contentName) return slugify(contentName);
    return autoContentFromUrl;
  }, [contentName, autoContentFromUrl]);

  const externalWebsiteUrl = useMemo(() => {
    const params = {
      utm_source: "website",
      utm_medium: "referral",
    };
    if (includeCampaign && campaign) params.utm_campaign = slugify(campaign);
    if (normalizedContent) params.utm_content = normalizedContent;
    return appendUtm(baseUrl, params);
  }, [baseUrl, campaign, includeCampaign, normalizedContent]);

  const linkedinUrl = useMemo(() => {
    const params = {
      utm_source: "linkedin",
      utm_medium: "social",
    };
    if (includeCampaign && campaign) params.utm_campaign = slugify(campaign);
    if (normalizedContent) params.utm_content = normalizedContent;
    return appendUtm(baseUrl, params);
  }, [baseUrl, campaign, includeCampaign, normalizedContent]);

  const newsletterUrl = useMemo(() => {
    const params = {
      utm_source: "newsletter",
      utm_medium: "email",
    };
    if (includeCampaign && campaign) params.utm_campaign = slugify(campaign);
    if (normalizedContent) params.utm_content = normalizedContent;
    return appendUtm(baseUrl, params);
  }, [baseUrl, campaign, includeCampaign, normalizedContent]);

  const copyToClipboard = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      alert("Link gekopieerd");
    } catch {
      alert("Kopiëren mislukt");
    }
  };

  const reset = () => {
    setBaseUrl("");
    setCampaign("");
    setContentName("");
    setIncludeCampaign(true);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>DutchIT.com UTM-generator</h1>
        <p className="intro">
          Plak de URL van een bericht van Dutch IT Channel, Dutch IT Leaders of
          MSP Business en genereer direct de juiste links voor LinkedIn, de
          nieuwsbrief en externe sites.
        </p>

        <div className="card">
          <h2>Invoer</h2>

          <label htmlFor="baseUrl">Website-URL van het artikel</label>
          <input
            id="baseUrl"
            type="text"
            placeholder="https://www.dutchitleaders.nl/interview/..."
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
          />

          <label htmlFor="campaign">Campagnenaam (optioneel)</label>
          <input
            id="campaign"
            type="text"
            placeholder="bijv-dagelijks-of-weekoverzicht"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
          />

          <label htmlFor="contentName">Optioneel: contentnaam</label>
          <input
            id="contentName"
            type="text"
            placeholder="de-leesbare-titel-van-je-artikel-uit-de-url"
            value={contentName}
            onChange={(e) => setContentName(e.target.value)}
          />

          <label htmlFor="includeCampaign">utm_campaign opnemen</label>
          <select
            id="includeCampaign"
            value={includeCampaign ? "ja" : "nee"}
            onChange={(e) => setIncludeCampaign(e.target.value === "ja")}
          >
            <option value="ja">Ja</option>
            <option value="nee">Nee</option>
          </select>

          <button className="secondary" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Verwijslink naar artikel voor externe sites</h2>
            <p className="small">
              Gebruik deze link als een adverteerder, partner of andere externe
              site naar het artikel verwijst.
            </p>
            <div className="output">
              {externalWebsiteUrl || "Voer eerst een geldige URL in"}
            </div>
            <button onClick={() => copyToClipboard(externalWebsiteUrl)}>
              Kopiëren
            </button>
          </div>

          <div className="card">
            <h2>LinkedIn</h2>
            <p className="small">
              Bron = linkedin, medium = social. Content wordt automatisch uit de
              URL gehaald als je niets invult.
            </p>
            <div className="output">
              {linkedinUrl || "Voer eerst een geldige URL in"}
            </div>
            <button onClick={() => copyToClipboard(linkedinUrl)}>
              Kopiëren
            </button>
          </div>

          <div className="card">
            <h2>Nieuwsbrief</h2>
            <p className="small">
              Bron = newsletter, medium = email. Content wordt automatisch uit
              de URL gehaald als je niets invult.
            </p>
            <div className="output">
              {newsletterUrl || "Voer eerst een geldige URL in"}
            </div>
            <button onClick={() => copyToClipboard(newsletterUrl)}>
              Kopiëren
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Standaard die dit tooltje gebruikt</h2>
          <ul>
            <li>
              <strong>Externe sites:</strong> utm_source=website,
              utm_medium=referral
            </li>
            <li>
              <strong>LinkedIn:</strong> utm_source=linkedin,
              utm_medium=social
            </li>
            <li>
              <strong>Nieuwsbrief:</strong> utm_source=newsletter,
              utm_medium=email
            </li>
            <li>
              <strong>utm_campaign:</strong> optioneel, bijvoorbeeld dagelijks
              of weekoverzicht
            </li>
            <li>
              <strong>utm_content:</strong> automatisch uit de URL, of handmatig
              invulbaar
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
