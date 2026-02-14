import { t } from '../i18n'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing">
      <h1 className="landing-title">{t('landingTitle')}</h1>
      <p className="landing-subtitle">{t('landingSubtitle')}</p>
      <a href="#/new" className="landing-cta">{t('createNew')}</a>
    </div>
  )
}

export default LandingPage
