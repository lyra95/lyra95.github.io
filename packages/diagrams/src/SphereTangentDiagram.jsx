import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls }              from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

const W = 480, H = 480
const R = 1.0
const THETA = 1.05   // polar angle from +Y  (~60°)
const PHI   = 0.85   // azimuthal from +X    (~49°)

export default function SphereTangentDiagram() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current

    // ── Renderers ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(W, H)
    mount.appendChild(renderer.domElement)

    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(W, H)
    Object.assign(labelRenderer.domElement.style, { position: 'absolute', top: '0', pointerEvents: 'none' })
    mount.appendChild(labelRenderer.domElement)

    // ── Scene / Camera / Controls ─────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
    camera.position.set(2.0, 1.2, 2.6)

    scene.add(new THREE.AmbientLight(0xffffff, 0.85))

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08

    // ── Sphere ────────────────────────────────────────────────────────────
    // Faint fill so back-faces are visible
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(R, 32, 20),
      new THREE.MeshBasicMaterial({ color: 0x08080f, transparent: true, opacity: 0.12, side: THREE.FrontSide })
    ))
    // Latitude lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 })
    const SEG = 64
    for (let i = 1; i <= 11; i++) {
      const theta = (i / 12) * Math.PI
      const pts = []
      for (let j = 0; j <= SEG; j++) {
        const phi = (j / SEG) * Math.PI * 2
        pts.push(new THREE.Vector3(
          R * Math.sin(theta) * Math.cos(phi),
          R * Math.cos(theta),
          R * Math.sin(theta) * Math.sin(phi)
        ))
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat))
    }
    // Longitude lines
    for (let i = 0; i < 24; i++) {
      const phi = (i / 24) * Math.PI * 2
      const pts = []
      for (let j = 0; j <= SEG; j++) {
        const theta = (j / SEG) * Math.PI
        pts.push(new THREE.Vector3(
          R * Math.sin(theta) * Math.cos(phi),
          R * Math.cos(theta),
          R * Math.sin(theta) * Math.sin(phi)
        ))
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat))
    }

    // ── Coordinate axes ───────────────────────────────────────────────────
    const AL = 1.7
    const axisColors = [0xff4444, 0x44dd44, 0x4488ff]  // X: red, Y: green, Z: blue
    for (const [i, dir] of [[0,[1,0,0]],[1,[0,1,0]],[2,[0,0,1]]]) {
      const mat = new THREE.LineBasicMaterial({ color: axisColors[i], transparent: true, opacity: 0.85, depthTest: false })
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...dir).multiplyScalar(-AL),
        new THREE.Vector3(...dir).multiplyScalar( AL),
      ])
      scene.add(new THREE.Line(g, mat))
    }

    // ── Tangent point p ───────────────────────────────────────────────────
    const p = new THREE.Vector3(
      R * Math.sin(THETA) * Math.cos(PHI),
      R * Math.cos(THETA),
      R * Math.sin(THETA) * Math.sin(PHI)
    )
    const n      = p.clone().normalize()
    const eTheta = new THREE.Vector3(
      Math.cos(THETA) * Math.cos(PHI), -Math.sin(THETA), Math.cos(THETA) * Math.sin(PHI)
    ).normalize()
    const ePhi = new THREE.Vector3(-Math.sin(PHI), 0, Math.cos(PHI)).normalize()

    // ── Tangent plane T_pM ────────────────────────────────────────────────
    const PS = 0.55
    // Corners: P(s,t) = p + s·eθ + t·eφ
    const planePts = [[-PS,-PS],[+PS,-PS],[+PS,+PS],[-PS,+PS]].map(([s, t]) => {
      const v = p.clone().addScaledVector(eTheta, s).addScaledVector(ePhi, t)
      return [v.x, v.y, v.z]
    })
    const planeGeo = new THREE.BufferGeometry()
    planeGeo.setAttribute('position', new THREE.Float32BufferAttribute(planePts.flat(), 3))
    planeGeo.setIndex([0, 1, 2,  0, 2, 3])
    scene.add(new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({
      color: 0xcc2200, transparent: true, opacity: 0.55, side: THREE.DoubleSide,
    })))

    // Grid lines on plane
    const gridPts = []
    for (let k = -4; k <= 4; k++) {
      const s = (k / 4) * PS
      const a = p.clone().addScaledVector(eTheta,  s ).addScaledVector(ePhi, -PS)
      const b = p.clone().addScaledVector(eTheta,  s ).addScaledVector(ePhi, +PS)
      const c = p.clone().addScaledVector(eTheta, -PS).addScaledVector(ePhi,  s )
      const d = p.clone().addScaledVector(eTheta, +PS).addScaledVector(ePhi,  s )
      gridPts.push(a.x,a.y,a.z, b.x,b.y,b.z, c.x,c.y,c.z, d.x,d.y,d.z)
    }
    const gridGeo = new THREE.BufferGeometry()
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPts, 3))
    scene.add(new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({
      color: 0xff5533, transparent: true, opacity: 0.42,
    })))

    // Plane border
    const borderGeo = new THREE.BufferGeometry()
    borderGeo.setAttribute('position', new THREE.Float32BufferAttribute([...planePts, planePts[0]].flat(), 3))
    scene.add(new THREE.Line(borderGeo, new THREE.LineBasicMaterial({ color: 0xff6644 })))

    // ── Point p ───────────────────────────────────────────────────────────
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    dot.position.copy(p)
    scene.add(dot)

    // ── Vector v = tangent to γ at p (= eθ direction) ────────────────────
    scene.add(new THREE.ArrowHelper(eTheta, p, 0.55, 0xffcc00, 0.12, 0.065))

    // ── Labels ────────────────────────────────────────────────────────────
    const label = (html, pos, color = '#e8eaf6') => {
      const el = document.createElement('div')
      el.innerHTML = html
      el.style.cssText = `font: italic 14px Georgia,serif; color:${color}; pointer-events:none; white-space:nowrap`
      const obj = new CSS2DObject(el)
      obj.position.copy(pos)
      scene.add(obj)
    }

    label('M',
      new THREE.Vector3(0, -R - 0.22, 0))
    label('p',
      p.clone().addScaledVector(n, 0.20))
    label('v',
      p.clone().addScaledVector(eTheta, 0.68), '#ffdd44')
    label('T<sub style="font-size:9px;vertical-align:baseline">p</sub>M',
      p.clone().addScaledVector(eTheta, PS * 0.55).addScaledVector(ePhi, -PS * 0.95).addScaledVector(n, 0.08),
      '#ff8866')

    // ── Render loop ───────────────────────────────────────────────────────
    let raf
    const tick = () => {
      raf = requestAnimationFrame(tick)
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      controls.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement))      mount.removeChild(renderer.domElement)
      if (mount.contains(labelRenderer.domElement)) mount.removeChild(labelRenderer.domElement)
    }
  }, [])

  return (
    <figure style={{ margin: '2rem 0', textAlign: 'center', userSelect: 'none' }}>
      <div ref={mountRef} style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }} />
      <figcaption style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
        Sphere <span translate="no"><InlineMath math="M" /></span> and its tangent space <span translate="no"><InlineMath math="T_pM" /></span>.
      </figcaption>
    </figure>
  )
}
