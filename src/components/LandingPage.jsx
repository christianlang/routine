import { useState } from 'react'
import { t } from '../i18n'
import './LandingPage.css'

function LandingPage() {
  const [linkInput, setLinkInput] = useState('')
  const [error, setError] = useState(false)

  function handleLoadRoutine(e) {
    e.preventDefault()
    const input = linkInput.trim()
    if (!input) return

    // Extract ID from various formats:
    // - Full URL with ?id=xxx
    // - Full URL with #/xxx
    // - Just the ID
    let id = null
    try {
      const url = new URL(input)
      id = url.searchParams.get('id')
      if (!id) {
        const hash = url.hash.replace(/^#\/?/, '').split('/')[0]
        if (hash) id = hash
      }
    } catch {
      // Not a URL — treat as raw ID
      if (/^[a-zA-Z0-9]+$/.test(input)) {
        id = input
      }
    }

    if (id) {
      setError(false)
      window.location.hash = `#/${id}`
    } else {
      setError(true)
    }
  }

  return (
    <div className="landing">
      <h1 className="landing-title">{t('landingTitle')}</h1>
      <p className="landing-subtitle">{t('landingSubtitle')}</p>
      <a href="#/new" className="landing-cta">{t('createNew')}</a>

      <div className="landing-divider">
        <span>{t('or')}</span>
      </div>

      <form className="landing-load" onSubmit={handleLoadRoutine}>
        <p className="landing-load-label">{t('loadExisting')}</p>
        <div className="landing-load-row">
          <input
            type="text"
            className="landing-load-input"
            placeholder={t('loadPlaceholder')}
            value={linkInput}
            onChange={(e) => { setLinkInput(e.target.value); setError(false) }}
          />
          <button type="submit" className="landing-load-btn">{t('loadButton')}</button>
        </div>
        {error && <p className="landing-load-error">{t('loadError')}</p>}
      </form>
    </div>
  )
}

export default LandingPage
