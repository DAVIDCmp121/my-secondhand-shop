import './App.css'
import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useParams, useLocation } from 'react-router-dom'

const products = [
  { id: 1, name: "BAPE ", price: 15000, category: "premium", image: "/images/BAPE.jpeg", images: ["/images/BAPE.jpeg", "/images/B1.jpeg", "/images/B2.jpeg"], detail: "ສະພາບດີ ບໍມີຕຳນິ" },
  { id: 2, name: "Hoodie", price: 400, category: "hoodie", image: "/images/Hoodie.jpeg", images: ["/images/Hoodie.jpeg", "/images/H1.jpeg", "/images/H2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 3, name: "POLO", price: 450, category: "polo", image: "/images/POLO.jpeg", images: ["/images/POLO.jpeg", "/images/P1.jpeg", "/images/P2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 4, name: "VLONE", price: 450, category: "premium", image: "/images/VLONE.jpeg", images: ["/images/VLONE.jpeg", "/images/V1.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 5, name: "I don't smoke", price: 450, category: "hoodie", image: "/images/ID.jpeg", images: ["/images/ID.jpeg", "/images/S1.jpeg", "/images/S2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນ" },
  { id: 6, name: "Onitsuka Tiger", price: 450, category: "premium", image: "/images/ONITSUKATIGER.jpeg", images: ["/images/ONITSUKATIGER.jpeg", "/images/O1.jpeg", "/images/O2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
]

const categoryLabels = { all: "ທັງໝດ", hoodie: "Hoodie", polo: "Polo", premium: "Premium" }
const categoryColors = { hoodie: "#2f80ed", polo: "#12b886", premium: "#f5a623" }

/* ===== Hook: scroll reveal ===== */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ===== Hook: count-up numbers ===== */
function CountUp({ end, duration = 1200, suffix = "" }) {
  const [ref, visible] = useReveal()
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!visible) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
      else setVal(end)
    }
    requestAnimationFrame(step)
  }, [visible])
  return <strong ref={ref}>{val}{suffix}</strong>
}

/* ===== Ripple button wrapper ===== */
function Ripple(e) {
  const btn = e.currentTarget
  const circle = document.createElement("span")
  const d = Math.max(btn.clientWidth, btn.clientHeight)
  circle.style.width = circle.style.height = `${d}px`
  circle.style.left = `${e.clientX - btn.getBoundingClientRect().left - d / 2}px`
  circle.style.top = `${e.clientY - btn.getBoundingClientRect().top - d / 2}px`
  circle.className = "ripple"
  btn.appendChild(circle)
  setTimeout(() => circle.remove(), 600)
}

/* ===== Promo Bar (marquee) ===== */
function PromoBar() {
  const text = "🚚 ສົງທົ່ວປະເທດ　💯 ຂອງແທ້ 100%　🔄 ປ່ຽນໄດ້ຫາກສິນຄ້າບໍ່ຕົງປົກ　🔥 ອັບເດດສິນຄ້າໃໝ່ທຸກອາທິດ　"
  return (
    <div className="promo-bar">
      <div className="marquee">
        <span>{text}{text}</span>
      </div>
    </div>
  )
}

/* ===== Navbar (glass on scroll) ===== */
function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  const links = [
    { to: "/", label: "ໜ້າຫຼັກ" },
    { to: "/categories", label: "ໝວດໝູ່" },
    { to: "/about", label: "ກ່ຽວກັບຮ້ານ" },
    { to: "/contact", label: "ຕິດຕໍ່ເຮົາ" },
  ]
  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <Link to="/" className="navbar-logo">Vintage <span>DS</span></Link>
      <div className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? "active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

/* ===== Product card with mouse-glow ===== */
function ProductCard({ product, index }) {
  const cardRef = useRef(null)
  const handleMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`)
    card.style.setProperty("--my", `${e.clientY - rect.top}px`)
  }
  return (
    <Link
      ref={cardRef}
      to={`/product/${product.id}`}
      className="product-card"
      style={{ animationDelay: `${index * 0.07}s` }}
      onMouseMove={handleMove}
    >
      <div className="card-glow"></div>
      <div className="product-img-wrap">
        <span className="category-chip" style={{ background: categoryColors[product.category] }}>
          {categoryLabels[product.category]}
        </span>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-card-info">
        <h3>{product.name}</h3>
        <div className="stars">★★★★★</div>
        <p className="price-tag">ລາຄາ {product.price.toLocaleString()} ບາດ</p>
      </div>
    </Link>
  )
}

/* ===== Back to top button ===== */
function BackToTop() {
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100
      setProgress(scrolled)
      setShow(h.scrollTop > 400)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  const circumference = 2 * Math.PI * 18
  return (
    <button
      className={`back-to-top ${show ? "show" : ""}`}
      onClick={(e) => { Ripple(e); window.scrollTo({ top: 0, behavior: "smooth" }) }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" className="progress-bg" />
        <circle
          cx="22" cy="22" r="18" className="progress-fg"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
        />
      </svg>
      <span>↑</span>
    </button>
  )
}

/* ===== Home ===== */
function Home() {
  const [filter, setFilter] = useState("all")
  const [animKey, setAnimKey] = useState(0)

  const filteredProducts = filter === "all" ? products : products.filter((p) => p.category === filter)

  const changeFilter = (key) => {
    setFilter(key)
    setAnimKey((k) => k + 1)
  }

  return (
    <div>
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-particles">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="particle" style={{ "--i": i }}></span>
          ))}
        </div>
        <img src="/images/logo.jpeg" alt="Vintage DS" className="hero-logo" />
        <h1 className="shop-title">Vintage DS</h1>
        <p className="shop-subtitle">ຂາຍຫລາຍຢ່າງ ແຕ່ບໍ່ຫລາຍໃຈ</p>

        <div className="trust-badges">
          <div className="trust-badge">
            <CountUp end={products.length} suffix="+" />
            <span>ລາຍການສິນຄ້າ</span>
          </div>
          <div className="trust-badge">
            <CountUp end={100} suffix="%" />
            <span>ຕົງປົກ</span>
          </div>
          <div className="trust-badge">
            <CountUp end={24} suffix="ຊມ." />
            <span>ຕອບແຊັດໄວ</span>
          </div>
        </div>
      </section>

      <div className="filter-bar">
        {Object.keys(categoryLabels).map((key) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? "active" : ""}`}
            onClick={(e) => { Ripple(e); changeFilter(key) }}
          >
            {categoryLabels[key]}
          </button>
        ))}
      </div>

      <Reveal>
        <div className="section-label">
          <h2>ສິນຄ້າແນະນຳ</h2>
          <span>{filteredProducts.length} ລາຍການ</span>
        </div>
      </Reveal>

      <div className="product-grid" key={animKey}>
        {filteredProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <Reveal>
        <section className="why-us">
          <div className="why-us-item">
            <div className="why-us-icon">🧵</div>
            <h4>ຄັດເລືອກສີນຄ້າທີ່ດີ</h4>
            <p>ທຸກຕົວກວດເຊັກສະພາບກ່ອນລົງຂາຍ</p>
          </div>
          <div className="why-us-item">
            <div className="why-us-icon">⚡</div>
            <h4>ອັບເດດໄວ</h4>
            <p>ສິນຄ້າໃໝ່ທຸກອາທິດ ຕິດຕາມໄດ້ເລີຍ</p>
          </div>
          <div className="why-us-item">
            <div className="why-us-icon">🤝</div>
            <h4>ລາຄາເປັນກັນເອງ</h4>
            <p>ຄຸ້ມຄ່າ ສະພາບດີ ລາຄາເປັນກັນເອງ</p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="testimonials">
          <h2>ລູກຄ້າເວົ້າວ່າແນວໃດ</h2>
          <div className="testimonial-grid">
            {[
              { name: "ລູກຄ້າ", text: "ສິນຄ້າສະພາບດີຫຼາຍ ຕົງຕາມຮູບ ສົ່ງໄວທັນໃຈ" },
              { name: "ລູກຄ້າ", text: "ລາຄາດີ ຕອບແຊັດໄວ ຈະອຸດໜູນຕໍ່ແນນອນ" },
              { name: "ລູກຄ້າ", text: "ຄຸ້ມຄ່າ​ຄຸ້ມລາຄາຫຼາຍໆ" },
            ].map((t, i) => (
              <div className="testimonial-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stars">★★★★★</div>
                <p>"{t.text}"</p>
                <span className="testimonial-name">— {t.name}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="newsletter">
          <h3>ຢາກໄດ້ຂອງໃໝ່ກ່ອນໃຜ?</h3>
          <p>ທັກ Facebook ໄວ້ ເພື່ອຮັບແຈ້ງເຕືອນເມື່ອມີສິນຄ້າໃໝ່</p>
          <a
            href="https://www.facebook.com/share/1Lbrzf1wqb/?mibextid=wwXIfr"
            target="_blank" rel="noopener noreferrer"
            className="newsletter-btn"
            onClick={Ripple}
          >
            ທັກ Facebook ເລີຍ →
          </a>
        </section>
      </Reveal>
    </div>
  )
}

/* ===== Product Detail ===== */
function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === parseInt(id))
  const [activeImg, setActiveImg] = useState(0)
  const imgRef = useRef(null)

  if (!product) return <p style={{ padding: "40px", textAlign: "center" }}>ไม่พบสินค้า</p>

  const handleZoom = (e) => {
    const img = imgRef.current
    if (!img) return
    const rect = img.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    img.style.transformOrigin = `${x}% ${y}%`
  }

  return (
    <div className="detail-page">
      <div className="breadcrumb">
        <Link to="/">ໜ້າຫຼັກ</Link> / <span>{product.name}</span>
      </div>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div
            className="detail-main-img"
            onMouseMove={handleZoom}
            onMouseLeave={() => { if (imgRef.current) imgRef.current.style.transformOrigin = "center" }}
          >
            <img ref={imgRef} key={activeImg} src={product.images[activeImg]} alt={product.name} className="zoom-img" />
          </div>
          <div className="detail-thumbs">
            {product.images.map((img, i) => (
              <img
                key={i} src={img} alt={`${product.name} ${i + 1}`}
                className={`thumb ${activeImg === i ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        </div>

        <div className="detail-info">
          <span
            className="category-chip"
            style={{ background: categoryColors[product.category], position: "static", display: "inline-block", marginBottom: "12px" }}
          >
            {categoryLabels[product.category]}
          </span>
          <h1>{product.name}</h1>
          <div className="stars detail-stars">★★★★★ <span>(5.0)</span></div>
          <p className="detail-price">{product.price.toLocaleString()} ບາດ</p>
          <p className="detail-desc">{product.detail}</p>
          <a
            href="https://www.facebook.com/share/1Lbrzf1wqb/?mibextid=wwXIfr"
            target="_blank" rel="noopener noreferrer"
            className="buy-btn" onClick={Ripple}
          >
            ທັກ Facebook ເພື່ອສັ່ງຊື້
          </a>
          <Link to="/" className="back-link">← ກັບໄປໜ້າຫຼັກ</Link>
        </div>
      </div>

      {/* sticky mobile buy bar */}
      <div className="sticky-buy-bar">
        <div>
          <strong>{product.price.toLocaleString()} ບາດ</strong>
          <span>{product.name}</span>
        </div>
        <a
          href="https://www.facebook.com/share/1Lbrzf1wqb/?mibextid=wwXIfr"
          target="_blank" rel="noopener noreferrer" onClick={Ripple}
        >
          ສັ່ງຊື້
        </a>
      </div>
    </div>
  )
}

/* ===== Categories ===== */
function Categories() {
  const [filter, setFilter] = useState("all")
  const filteredProducts = filter === "all" ? products : products.filter((p) => p.category === filter)

  return (
    <div>
      <section className="page-hero">
        <h1>ໝວດໝູ່ສິນຄ້າ</h1>
        <p>ເລືອກເບິ່ງສິນຄ້າຕາມປະເພດທີ່ທ່ານມັກ</p>
      </section>

      <div className="filter-bar">
        {Object.keys(categoryLabels).map((key) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? "active" : ""}`}
            onClick={(e) => { Ripple(e); setFilter(key) }}
          >
            {categoryLabels[key]}
          </button>
        ))}
      </div>

      <div className="product-grid" key={filter}>
        {filteredProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  )
}

/* ===== About ===== */
function About() {
  return (
    <div>
      <section className="page-hero">
        <h1>ກ່ຽວກັບ Vintage DS</h1>
        <p>ຮ້ານເສື້ອຜ້າມືສອງ ສະພາບດີ  ລາຄາເປັນກັນເອງ</p>
      </section>

      <div className="about-grid">
        {[
          { icon: "🎯", title: "ພາລະກິດຂອງພວກເຮົາ", text: "ຄັດເລືອກເສື້ອຜ້າມືສອງແທ້ຄຸນນະພາບດີ ນຳມາໃຫ້ລູກຄ້າໃນລາຄາທີ່ເຂົ້າເຖງໄດ້ງ່າຍ." },
          { icon: "✅", title: "ຄວາມໜ້າເຊື່ອຖື", text: "ທຸກຕົວກວດເຊັກສະພາບກ່ອນລົງຂາຍ ບໍ່ມີການປິດບັງຕຳນິ." },
          { icon: "💬", title: "ບໍລິການລູກຄ້າ", text: "ຕອບແຊັດໄວ ພອມໃຫ້ຄຳປຶກສາເລືອກໄຊສ໌ ແລະ ສະໄຕລ໌." },
        ].map((c, i) => (
          <Reveal key={i} delay={i * 100}>
            <div className="about-card">
              <div className="about-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ===== Contact ===== */
function Contact() {
  return (
    <div>
      <section className="page-hero">
        <h1>ຕິດຕໍ່ເຮົາ</h1>
        <p>ມີຄຳຖາມ ຫຼື ຢາກສັ່ງຊື້? ທັກຫາພວກເຮົາໄດ້ເລີຍ</p>
      </section>

      <Reveal>
        <div className="contact-card">
          <div className="contact-icon">📩</div>
          <h3>Facebook Page</h3>
          <p>ຊ່ອງທາງຫຼັກໃນການສັ່ງຊື້ ແລະ ສອບຖາມສິນຄ້າ</p>
          <a
            href="https://www.facebook.com/share/1Lbrzf1wqb/?mibextid=wwXIfr"
            target="_blank" rel="noopener noreferrer"
            className="buy-btn" onClick={Ripple}
          >
            ທັກ Facebook ເລີຍ
          </a>
        </div>
      </Reveal>
    </div>
  )
}

/* ===== Footer ===== */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4 className="footer-logo">Vintage DS</h4>
          <p>ເສື້ອຜ້າມືສອງ ສະພາບດີ  ລາຄາເປັນກັນເອງ</p>
        </div>
        <div>
          <h5>ໝວດໝູ່</h5>
          <ul><li>Hoodie</li><li>Polo</li><li>Premium</li></ul>
        </div>
        <div>
          <h5>ຕິດຕໍ່</h5>
          <a href="https://www.facebook.com/share/1Lbrzf1wqb/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Facebook Page</a>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Vintage DS. All rights reserved.</div>
    </footer>
  )
}

function App() {
  return (
    <>
      <PromoBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <BackToTop />
    </>
  )
}

export default App