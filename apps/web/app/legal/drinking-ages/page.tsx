// apps/web/app/legal/drinking-ages/page.tsx
import styles from './page.module.css';

export default function DrinkingAgesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className="container">
          <h1 className={`heading heading-xl ${styles.title}`}>Legal Drinking Ages Worldwide</h1>
          <p className={styles.subtitle}>
            Information about legal drinking ages by country and region
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.content}>
          <div className={styles.disclaimer}>
            <h2>Important Disclaimer</h2>
            <p>
              The information provided on this page is for general informational purposes only. 
              Drinking laws can change, and local variations may exist. Always verify the current 
              legal drinking age in your specific location.
            </p>
          </div>

          <div className={styles.regions}>
            <div className={styles.region}>
              <h2>North America</h2>
              <div className={styles.countryList}>
                <div className={styles.country}>
                  <h3>United States</h3>
                  <p><strong>Legal Drinking Age:</strong> 21</p>
                  <p className={styles.note}>
                    Note: Some states have exceptions for consumption under parental supervision
                  </p>
                </div>
                <div className={styles.country}>
                  <h3>Canada</h3>
                  <p><strong>Legal Drinking Age:</strong> 18 or 19</p>
                  <p className={styles.note}>
                    Alberta, Manitoba, Quebec: 18<br />
                    All other provinces: 19
                  </p>
                </div>
                <div className={styles.country}>
                  <h3>Mexico</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
              </div>
            </div>

            <div className={styles.region}>
              <h2>Europe</h2>
              <div className={styles.countryList}>
                <div className={styles.country}>
                  <h3>United Kingdom</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                  <p className={styles.note}>
                    Note: 16-17 year olds can drink beer, wine or cider with a meal if accompanied by an adult
                  </p>
                </div>
                <div className={styles.country}>
                  <h3>Germany</h3>
                  <p><strong>Legal Drinking Age:</strong> 16 for beer/wine, 18 for spirits</p>
                </div>
                <div className={styles.country}>
                  <h3>France</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
                <div className={styles.country}>
                  <h3>Italy</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
                <div className={styles.country}>
                  <h3>Spain</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
              </div>
            </div>

            <div className={styles.region}>
              <h2>Asia</h2>
              <div className={styles.countryList}>
                <div className={styles.country}>
                  <h3>Japan</h3>
                  <p><strong>Legal Drinking Age:</strong> 20</p>
                </div>
                <div className={styles.country}>
                  <h3>China</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
                <div className={styles.country}>
                  <h3>South Korea</h3>
                  <p><strong>Legal Drinking Age:</strong> 19</p>
                </div>
                <div className={styles.country}>
                  <h3>India</h3>
                  <p><strong>Legal Drinking Age:</strong> Varies by state (18-25)</p>
                  <p className={styles.note}>
                    Most states: 18 or 21
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.region}>
              <h2>Oceania</h2>
              <div className={styles.countryList}>
                <div className={styles.country}>
                  <h3>Australia</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
                <div className={styles.country}>
                  <h3>New Zealand</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
              </div>
            </div>

            <div className={styles.region}>
              <h2>South America</h2>
              <div className={styles.countryList}>
                <div className={styles.country}>
                  <h3>Brazil</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
                <div className={styles.country}>
                  <h3>Argentina</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
                <div className={styles.country}>
                  <h3>Chile</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
              </div>
            </div>

            <div className={styles.region}>
              <h2>Africa</h2>
              <div className={styles.countryList}>
                <div className={styles.country}>
                  <h3>South Africa</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
                <div className={styles.country}>
                  <h3>Nigeria</h3>
                  <p><strong>Legal Drinking Age:</strong> 18</p>
                </div>
                <div className={styles.country}>
                  <h3>Egypt</h3>
                  <p><strong>Legal Drinking Age:</strong> 21</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.importantNotice}>
            <h2>Important Notice</h2>
            <p>
              This information may not be comprehensive or completely up-to-date. Laws and regulations 
              regarding alcohol consumption can change, and there may be local variations within countries. 
              Always verify the current legal drinking age in your specific location before consuming alcohol.
            </p>
            <p>
              ThePregames does not encourage underage drinking and promotes responsible consumption for those 
              of legal age. If you are not of legal drinking age in your region, please exit this site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}