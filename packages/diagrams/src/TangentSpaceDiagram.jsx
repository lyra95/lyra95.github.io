import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'

const W = 520, H = 380
const U0 = 0.35, V0 = -0.25
const UMIN = -1.5, UMAX = 1.5, VMIN = -1.2, VMAX = 1.2

function sH(u, v) {
  return 0.35 - 0.20 * (u * u + v * v * 0.75) + 0.04 * u * v
}
function sGrad(u, v) {
  const e = 1e-4
  return {
    du: (sH(u + e, v) - sH(u - e, v)) / (2 * e),
    dv: (sH(u, v + e) - sH(u, v - e)) / (2 * e),
  }
}

export default function TangentSpaceDiagram() {
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

    // ── Scene / Camera / Lights ───────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100)
    camera.position.set(1.8, 1.9, 3.5)

    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    const sun = new THREE.DirectionalLight(0xffffff, 0.85)
    sun.position.set(3, 5, 4)
    scene.add(sun)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0.15, 0.1, 0)
    controls.enableDamping = true
    controls.dampingFactor = 0.08

    // ── Manifold surface ──────────────────────────────────────────────────
    const N = 28
    const verts = [], idx = []
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
      const u = UMIN + (i / N) * (UMAX - UMIN)
      const v = VMIN + (j / N) * (VMAX - VMIN)
      verts.push(u, sH(u, v), v)
    }
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const a = i * (N + 1) + j
      idx.push(a, a + 1, a + N + 2,  a, a + N + 2, a + N + 1)
    }
    const surfGeo = new THREE.BufferGeometry()
    surfGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    surfGeo.setIndex(idx)
    surfGeo.computeVertexNormals()

    scene.add(new THREE.Mesh(surfGeo, new THREE.MeshPhongMaterial({
      color: 0x505068, specular: 0x333350, shininess: 25, side: THREE.DoubleSide,
    })))
    scene.add(new THREE.Mesh(surfGeo.clone(), new THREE.MeshBasicMaterial({
      color: 0x36364e, wireframe: true, transparent: true, opacity: 0.55,
    })))

    // ── Tangent plane — corners computed directly from Tu and Tv ──────────
    // P(s,t) = (U0+s, y0 + s*dyu + t*dyv, V0+t)
    const y0 = sH(U0, V0)
    const { du: dyu, dv: dyv } = sGrad(U0, V0)
    const PS = 1.1
    const corners = [[-PS,-PS],[+PS,-PS],[+PS,+PS],[-PS,+PS]].map(([s, t]) =>
      [U0 + s,  y0 + s * dyu + t * dyv,  V0 + t])

    const planeGeo = new THREE.BufferGeometry()
    planeGeo.setAttribute('position', new THREE.Float32BufferAttribute(corners.flat(), 3))
    planeGeo.setIndex([0, 1, 2,  0, 2, 3])
    scene.add(new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({
      color: 0xb0bcd8, transparent: true, opacity: 0.30, side: THREE.DoubleSide,
    })))

    // Grid lines
    const gridPts = []
    for (let k = -6; k <= 6; k++) {
      const s = (k / 6) * PS
      gridPts.push(
        U0 + s, y0 + s * dyu - PS * dyv, V0 - PS,
        U0 + s, y0 + s * dyu + PS * dyv, V0 + PS,
        U0 - PS, y0 - PS * dyu + s * dyv, V0 + s,
        U0 + PS, y0 + PS * dyu + s * dyv, V0 + s,
      )
    }
    const gridGeo = new THREE.BufferGeometry()
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPts, 3))
    scene.add(new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({
      color: 0x8899cc, transparent: true, opacity: 0.40,
    })))

    // Border
    const borderGeo = new THREE.BufferGeometry()
    borderGeo.setAttribute('position', new THREE.Float32BufferAttribute([...corners, corners[0]].flat(), 3))
    scene.add(new THREE.Line(borderGeo, new THREE.LineBasicMaterial({ color: 0xa0aed8 })))

    // ── Curve γ(t) ────────────────────────────────────────────────────────
    const curvePts = Array.from({ length: 50 }, (_, k) => {
      const t = k / 49
      const cu = U0 - 1.1 * (1 - t), cv = V0 - 0.7 * (1 - t)
      return new THREE.Vector3(cu, sH(cu, cv), cv)
    })
    scene.add(new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePts), 60, 0.022, 8),
      new THREE.MeshBasicMaterial({ color: 0xb06040 })
    ))

    // ── Point x ───────────────────────────────────────────────────────────
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    dot.position.set(U0, y0, V0)
    scene.add(dot)

    // ── Vector v ──────────────────────────────────────────────────────────
    const vDir = new THREE.Vector3(0.8, 0.8 * dyu + 0.3 * dyv, 0.3).normalize()
    scene.add(new THREE.ArrowHelper(vDir, new THREE.Vector3(U0, y0, V0), 0.70, 0x5599ff, 0.14, 0.07))

    // ── Labels ────────────────────────────────────────────────────────────
    const label = (html, pos, color = '#c0c4dc') => {
      const el = document.createElement('div')
      el.innerHTML = html
      el.style.cssText = `font: italic 14px Georgia,serif; color:${color}; pointer-events:none; white-space:nowrap`
      const obj = new CSS2DObject(el)
      obj.position.set(...pos)
      scene.add(obj)
    }

    label('M',    [UMAX - 0.25, sH(UMAX - 0.25, VMAX - 0.25) - 0.1, VMAX - 0.25])
    label('x',    [U0 + 0.12, y0 + 0.10, V0])
    label('v',    [U0 + 0.48, y0 + 0.38, V0 + 0.23], '#88aaff')
    label('γ(t)', [U0 - 0.82, sH(U0 - 0.82, V0 - 0.55) + 0.12, V0 - 0.55], '#c07858')
    label('T<sub style="font-size:9px;vertical-align:baseline">x</sub>M',
          [U0 - 0.5, y0 + 0.52, V0 + PS * 0.85])

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
      mount.removeChild(renderer.domElement)
      mount.removeChild(labelRenderer.domElement)
    }
  }, [])

  return (
    <figure style={{ margin: '2rem 0', textAlign: 'center', userSelect: 'none' }}>
      <div ref={mountRef} style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }} />
      <figcaption style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
        Manifold M, tangent space T&#x2093;M, curve γ(t), tangent vector v — drag to rotate.
      </figcaption>
    </figure>
  )
}
