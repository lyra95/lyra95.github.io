import './math-block.css'

/**
 * <Exercise title="1.3">
 *   Show that every continuous function on $[0,1]$ is bounded.
 * </Exercise>
 *
 * `title` is optional.
 */
export default function Exercise({ title, children }) {
  return (
    <aside className="math-block-exercise">
      <span className="math-block-label">
        Exercise{title ? `: ${title}` : ''}
      </span>
      <div className="math-block-body">{children}</div>
    </aside>
  )
}
