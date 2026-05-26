import 'katex/dist/katex.min.css'
import './math-block.css'
import { InlineMath, BlockMath } from 'react-katex'

/**
 * Renders a display (block) math expression.
 * Usage: <MathBlock>{`\\int_0^\\infty e^{-x^2} dx`}</MathBlock>
 */
export function MathBlock({ children }) {
  return (
    <div className="math-block" translate="no">
      <BlockMath math={children} />
    </div>
  )
}

/**
 * Renders an inline math expression.
 * Usage: <MathInline>{'e^{i\\pi} + 1 = 0'}</MathInline>
 */
export function MathInline({ children }) {
  return <span translate="no"><InlineMath math={children} /></span>
}
