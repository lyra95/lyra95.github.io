import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="site-logo">
          <div className="logo-icon">∑</div>
          <span>MathBlog</span>
        </NavLink>
      </div>
    </header>
  )
}
