import './math-block.css'

/**
 * <Callout type="note">This is worth keeping in mind.</Callout>
 * <Callout type="warning">Be careful here.</Callout>
 * <Callout type="example">Let $f(x) = x^2$…</Callout>
 * <Callout type="insight">The key idea is…</Callout>
 *
 * `type` defaults to "note".
 */
const CONFIG = {
  note:    { label: 'Note',    icon: '💡' },
  warning: { label: 'Warning', icon: '⚠️' },
  example: { label: 'Example', icon: '✏️' },
  insight: { label: 'Insight', icon: '🔍' },
}

export default function Callout({ type = 'note', children }) {
  const { label, icon } = CONFIG[type] ?? CONFIG.note
  return (
    <aside className={`math-block-callout math-block-callout--${type}`}>
      <span className="math-block-callout-header">
        <span className="math-block-callout-icon">{icon}</span>
        {label}
      </span>
      <div className="math-block-body">{children}</div>
    </aside>
  )
}
