// Barrel for the MDX prose components. Posts import what they use from here in
// one line, e.g. `import { MathBlock, Callout } from '../../components/math-block'`.
// Per-file imports (instead of an <MDXProvider>) keep go-to-definition working
// in editors that don't support MDX's MDXProvidedComponents convention.
export { MathBlock, MathInline } from './MathBlock.jsx'
export { default as Callout } from './Callout.jsx'
export { default as Definition } from './Definition.jsx'
export { default as Exercise } from './Exercise.jsx'
export { default as Proof } from './Proof.jsx'
export { default as Theorem } from './Theorem.jsx'