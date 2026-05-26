import './math-block.css'

/**
 * <Definition term="Continuity">
 *   A function $f$ is continuous at $x_0$ if …
 * </Definition>
 *
 * `term` is optional.
 */
export default function Definition({ term, children }) {
  return (
    <aside className="math-block-definition">
      <span className="math-block-label">
        Definition{term ? `: ${term}` : ''}
      </span>
      <div className="math-block-body">{children}</div>
    </aside>
  )
}
