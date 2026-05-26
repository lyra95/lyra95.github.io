import './math-block.css'

/**
 * <Theorem name="Pythagorean Theorem">
 *   For a right triangle with legs $a$, $b$ and hypotenuse $c$: $a^2 + b^2 = c^2$.
 * </Theorem>
 *
 * `name` is optional — omit it for an unnamed theorem.
 */
export default function Theorem({ name, children }) {
  return (
    <aside className="math-block-theorem">
      <span className="math-block-label">
        Theorem{name ? `: ${name}` : ''}
      </span>
      <div className="math-block-body">{children}</div>
    </aside>
  )
}
