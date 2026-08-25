import { useEffect, useState, type FormEvent } from 'react'
import { analyticsGate } from '../data/analytics'
import { loadTrafficSnapshot, type TrafficSnapshot } from '../lib/traffic'
import './HiddenAnalytics.css'

const SESSION_UNLOCK = 'kk_analytics_unlocked'

export function HiddenAnalytics() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_UNLOCK) === '1'
    } catch {
      return false
    }
  })
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snapshot, setSnapshot] = useState<TrafficSnapshot | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    document.title = 'Analytics · KHWEZI K'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => {
      robots.remove()
    }
  }, [])

  useEffect(() => {
    if (!unlocked) return
    let cancelled = false
    setLoading(true)
    setLoadError(false)
    void loadTrafficSnapshot()
      .then((data) => {
        if (!cancelled) setSnapshot(data)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [unlocked])

  const onUnlock = (event: FormEvent) => {
    event.preventDefault()
    if (password !== analyticsGate.password) {
      setError(true)
      return
    }
    try {
      sessionStorage.setItem(SESSION_UNLOCK, '1')
    } catch {
      // ignore
    }
    setError(false)
    setUnlocked(true)
  }

  const maxDay = Math.max(1, ...(snapshot?.days.map((d) => d.count) ?? [1]))

  return (
    <div className="analytics">
      <header className="analytics__header">
        <p className="analytics__eyebrow">KHWEZI K · Internal</p>
        <h1 className="analytics__title">Traffic</h1>
        <p className="analytics__lede">
          Site visits recorded from khwezik.com. Not linked publicly.
        </p>
      </header>

      {!unlocked ? (
        <form className="analytics__gate" onSubmit={onUnlock}>
          <label className="analytics__field">
            <span>Password</span>
            <input
              type="password"
              name="analytics-password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError(false)
              }}
              required
            />
          </label>
          {error && (
            <p className="analytics__error" role="alert">
              Incorrect password.
            </p>
          )}
          <button type="submit" className="analytics__btn">
            Unlock
          </button>
        </form>
      ) : (
        <div className="analytics__body">
          {loading && <p className="analytics__status">Loading…</p>}
          {loadError && (
            <p className="analytics__error" role="alert">
              Couldn’t load counters. Try again shortly.
            </p>
          )}
          {snapshot && !loading && (
            <>
              <div className="analytics__stats">
                <div>
                  <p className="analytics__stat-label">Pageviews</p>
                  <p className="analytics__stat-value">
                    {snapshot.pageviews.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="analytics__stat-label">Uniques</p>
                  <p className="analytics__stat-value">
                    {snapshot.uniques.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="analytics__stat-label">Today (UTC)</p>
                  <p className="analytics__stat-value">
                    {snapshot.today.toLocaleString()}
                  </p>
                </div>
              </div>

              <section className="analytics__section">
                <h2>Last 14 days</h2>
                <ul className="analytics__bars">
                  {snapshot.days.map((day) => (
                    <li key={day.key}>
                      <span className="analytics__bar-label">{day.label}</span>
                      <span className="analytics__bar-track">
                        <span
                          className="analytics__bar-fill"
                          style={{
                            width: `${Math.max(4, (day.count / maxDay) * 100)}%`,
                          }}
                        />
                      </span>
                      <span className="analytics__bar-count">{day.count}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="analytics__section">
                <h2>Sections</h2>
                <ul className="analytics__list">
                  {snapshot.paths.map((path) => (
                    <li key={path.id}>
                      <span>{path.label}</span>
                      <span>{path.count.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="analytics__section">
                <h2>Referrers</h2>
                {snapshot.referrers.length === 0 ? (
                  <p className="analytics__status">No referrer data yet.</p>
                ) : (
                  <ul className="analytics__list">
                    {snapshot.referrers.map((ref) => (
                      <li key={ref.host}>
                        <span>{ref.host}</span>
                        <span>{ref.count.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <button
                type="button"
                className="analytics__btn analytics__btn--ghost"
                onClick={() => {
                  setLoading(true)
                  void loadTrafficSnapshot()
                    .then(setSnapshot)
                    .catch(() => setLoadError(true))
                    .finally(() => setLoading(false))
                }}
              >
                Refresh
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
