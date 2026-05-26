import './math-block.css'

/**
 * <Proof>
 *   Suppose for contradiction that $\sqrt{2}$ is rational…
 * </Proof>
 *
 * Automatically appends the tombstone (∎) at the end.
 */
export default function Proof({ children }) {
  return (
    <details className="math-block-proof" open>
      <summary className="math-block-proof-summary">Proof</summary>
      <div className="math-block-body">
        {children}
        <span className="math-block-qed" aria-label="QED">∎</span>
      </div>
    </details>
  )
}
