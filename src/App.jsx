import React, { useMemo, useState } from 'react';

function appendUtm(baseUrl, params) {
  if (!baseUrl) return '';
  try {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    return '';
  }
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

function OutputCard({ title, description, value, emptyText }) {
  const copyToClipboard = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      window.prompt('Kopieer deze link handmatig:', value);
    }
  };

  return (
    <div className="card output-card">
      <h2>{title}</h2>
      <p className="muted">{description}</p>
      <div className="output-box">{value || emptyText}</div>
      <button className="button" onClick={copyToClipboard} disabled={!value}>
        Kopiëren
      </button>
    </div>
  );
}

export default function App() {
  const [baseUrl, setBaseUrl] = useState('');
  const [campaign, setCampaign] = useState('dagelijks');
  const [contentName, setContentName] = useState('');
  const [includeCampaign, setIncludeCampaign] = useState(true);

  const normalizedContent = useMemo(() => slugify(contentName), [contentName]);

  const linkedinUrl = useMemo(() => {
    const params = {
      utm_source: 'linkedin',
      utm_medium: 'social',
    };
    if (includeCampaign) params.utm_campaign = slugify(campaign || 'dagelijks');
    if (normalizedContent) params.utm_content = normalizedContent;
    return appendUtm(baseUrl, params);
  }, [baseUrl, campaign, includeCampaign, normalizedContent]);

  const newsletterUrl = useMemo(() => {
    const params = {
      utm_source: 'newsletter',
      utm_medium: 'email',
    };
    if (includeCampaign) params.utm_campaign = slugify(campaign || 'dagelijks');
    if (normalizedContent) params.utm_content = normalizedContent;
    return appendUtm(baseUrl, params);
  }, [baseUrl, campaign, includeCampaign, normalizedContent]);

  const websiteUrl = useMemo(() => baseUrl, [baseUrl]);

  const reset = () => {
    setBaseUrl('');
    setCampaign('dagelijks');
    setContentName('');
    setIncludeCampaign(true);
  };

  return (
    <div className="page">
      <div className="container">
        <header className="hero card">
          <h1>DutchIT.com UTM-generator</h1>
          <p>
            Plak de URL van een bericht van Dutch IT Channel, Dutch IT Leaders of MSP Business en genereer direct de juiste links voor LinkedIn en de nieuwsbrief.
            De URL bepaalt zelf het platform, de UTM-codes zorgen dat verkeer correct wordt gemeten in Analytics.
          </p>
        </header>

        <section className="card form-card">
          <h2>Invoer</h2>
          <div className="form-grid">
            <div className="field field-wide">
              <label htmlFor="baseUrl">Website-URL van het bericht</label>
              <input
                id="baseUrl"
                type="url"
                placeholder="https://www.dutchitleaders.nl/interview/..."
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="campaign">Campagne</label>
              <input
                id="campaign"
                type="text"
                placeholder="dagelijks"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="contentName">Optioneel: contentnaam</label>
              <input
                id="contentName"
                type="text"
                placeholder="jamf_nation_meet_up"
                value={contentName}
                onChange={(e) => setContentName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="includeCampaign">utm_campaign opnemen</label>
              <select
                id="includeCampaign"
                value={includeCampaign ? 'ja' : 'nee'}
                onChange={(e) => setIncludeCampaign(e.target.value === 'ja')}
              >
                <option value="ja">Ja</option>
                <option value="nee">Nee</option>
              </select>
            </div>

            <div className="field actions">
              <button className="button button-secondary" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
        </section>

        <section className="output-grid">
          <OutputCard
            title="Website"
            description="Gebruik op de eigen site zonder UTM."
            value={websiteUrl}
            emptyText="Nog geen URL ingevoerd"
          />
          <OutputCard
            title="LinkedIn"
            description="Bron = linkedin, medium = social."
            value={linkedinUrl}
            emptyText="Voer eerst een geldige URL in"
          />
          <OutputCard
            title="Nieuwsbrief"
            description="Bron = newsletter, medium = email."
            value={newsletterUrl}
            emptyText="Voer eerst een geldige URL in"
          />
        </section>

        <section className="card notes-card">
          <h2>Standaard die dit tooltje gebruikt</h2>
          <ul>
            <li><strong>Website:</strong> geen UTM</li>
            <li><strong>LinkedIn:</strong> utm_source=linkedin, utm_medium=social</li>
            <li><strong>Nieuwsbrief:</strong> utm_source=newsletter, utm_medium=email</li>
            <li><strong>utm_campaign:</strong> standaard op dagelijks, aanpasbaar per editie of reeks</li>
            <li><strong>utm_content:</strong> optioneel voor artikelniveau, bijvoorbeeld jamf_nation_meet_up</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
