import './App.css'
import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { Routes, Route, Link, useParams, useLocation, useNavigate } from 'react-router-dom'

const products = [
  { id: 1, name: "BAPE ລິຂະສິດແທ້", price: 559000, category: "BAPE", size: "L", image: "/images/BAPE.jpeg", images: ["/images/BAPE.jpeg", "/images/B1.jpeg", "/images/B2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 2, name: "Hoodie", price: 359000, category: "hoodie", size: "M", image: "/images/Hoodie.jpeg", images: ["/images/Hoodie.jpeg", "/images/H1.jpeg", "/images/H2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 3, name: "POLO", price: 289000, category: "polo", size: "L", image: "/images/POLO.jpeg", images: ["/images/POLO.jpeg", "/images/P1.jpeg", "/images/P2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 4, name: "VLONE", price: 289000, category: "premium", size: "M", image: "/images/VLONE.jpeg", images: ["/images/VLONE.jpeg", "/images/V1.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 5, name: "I don't smoke", price: 259000, category: "hoodie", size: "L", image: "/images/ID.jpeg", images: ["/images/ID.jpeg", "/images/S1.jpeg", "/images/S2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 6, name: "Onitsuka Tiger", price: 250000, category: "premium", size: "S", image: "/images/ONITSUKATIGER.jpeg", images: ["/images/ONITSUKATIGER.jpeg", "/images/O1.jpeg", "/images/O2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 7, name: "BAPE ", price: 350000, category: "BAPE", size: "M", image: "/images/a.jpeg", images: ["/images/a1.jpeg", "/images/a2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 8, name: "BAPE", price: 289000, category: "BAPE", size: "M", image: "/images/c.jpeg", images: ["/images/c1.jpeg", "/images/c2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 9, name: "NIKE", price: 359000, category: "NIKE", size: "L", image: "/images/d.jpeg", images: ["/images/d1.jpeg", "/images/d2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 10, name: "AAPE", price: 289000, category: "AAPE", size: "M", image: "/images/e.jpeg", images: ["/images/e1.jpeg", "/images/e2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 11, name: "NIKE", price: 389000, category: "NIKE", size: "L", image: "/images/f.jpeg", images: ["/images/f1.jpeg", "/images/f2.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
  { id: 12, name: "Arcteryx", price: 359000, category: "premium", size: "L", image: "/images/g.jpeg", images: ["/images/g1.jpeg", "/images/g2.jpeg", "/images/g3.jpeg"], detail: "ສະພາບດີ ບໍ່ມີຕຳນິ" },
]

const categoryLabels = { all: "ທັງໝົດ", hoodie: "Hoodie", polo: "Polo", premium: "Premium" }
const categoryColors = { hoodie: "#2f80ed", polo: "#12b886", premium: "#f5a623" }
const FB_PAGE = "https://www.facebook.com/share/1Lbrzf1wqb/?mibextid=wwXIfr"
const SALE_MAX_PRICE = 500

const faqData = [
  { q: "ສິນຄ້າແມ່ນຂອງແທ້ບໍ?", a: "ແທ້ 100% ທຸກຕົວກວດເຊັກສະພາບກ່ອນລົງຂາຍ." },
  { q: "ສັ່ງຊື້ແນວໃດ?", a: "ເລືອກສິນຄ້າ ໃສ່ຕະກ້າ ຫຼືກົດ 'ສັ່ງຊື້ເລີຍ' ຈາກນັ້ນຊຳລະຜ່ານ QR ແລ້ວກອບປີ້ຂໍ້ຄວາມສົ່ງໃນແຊັດ." },
  { q: "ຊຳລະເງິນແນວໃດ?", a: "ໂອນຜ່ານ QR ໃນໜ້າຊຳລະເງິນ ຈາກນັ້ນສົ່ງສະລິບໃຫ້ພວກເຮົາທາງ Facebook." },
  { q: "ສົ່ງເສື້ອຜ້າດົນປານໃດ?", a: "ໂດຍປົກກະຕິ 2-4 ວັນທຳການ ຫຼັງຢືນຢັນອໍເດີ." },
  { q: "ຖ້າສິນຄ້າບໍ່ຕົງກັບຮູບ ປ່ຽນໄດ້ບໍ?", a: "ປ່ຽນໄດ້ ຫາກສິນຄ້າບໍ່ຕົງກັບຮູບທີ່ລົງໄວ້ ພາຍໃນ 3 ວັນຫຼັງໄດ້ຮັບເສື້ອ." },
  { q: "ໄຊສ໌ບໍ່ພໍດີ ມີໄຊສ໌ອື່ນບໍ?", a: "ສິນຄ້າມືສອງແຕ່ລະຕົວມີພຽງ 1 ໄຊສ໌ ຕາມທີ່ລະບຸໄວ້ໃນໜ້າສິນຄ້າ." },
]

const reviewsData = [
  { name: "ນ້ອງແອັມ", text: "ສິນຄ້າສະພາບດີຫຼາຍ ຕົງຕາມຮູບ ສົ່ງໄວທັນໃຈ" },
  { name: "ພີ່ໂຕ", text: "ລາຄາຍຸດຕິທຳ ຕອບແຊັດໄວ ຈະອຸດໜູນຕໍ່ແນ່ນອນ" },
  { name: "ນ້ອງມິນ", text: "ຂອງແທ້ 100% ຄຸ້ມຄ່າຄຸ້ມລາຄາຫຼາຍໆ" },
  { name: "ອ້າຍນິງ", text: "ຫຸ້ຍ Hoodie ນຸ່ມ ສະພາບຄືກັບໃໝ່ ແນະນຳຮ້ານນີ້ເລີຍ" },
  { name: "ນ້ອງແພັມ", text: "ຮູບຊັດ ລາຍລະອຽດຄົບ ບໍ່ຫຼອກລວງ ໄວ້ໃຈໄດ້" },
  { name: "ພີ່ແບັງ", text: "ຊື້ໄປຫຼາຍຄັ້ງແລ້ວ ຄຸນນະພາບຄົງທີ່ ລາຄາເປັນກັນເອງ" },
  { name: "ນ້ອງນິວ", text: "ແພັກສິນຄ້າດີ ບໍ່ຢ້ານເປື້ອນ ມາຮອດໄວ" },
  { name: "ອ້າຍໂອ", text: "POLO ໄດ້ຄືຮູບ 100% ພໍໃຈຫຼາຍ" },
]

/* ================= Cart Context ================= */
const CartContext = createContext(null)
function useCart() { return useContext(CartContext) }

function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("vintage-ds-cart")
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => { localStorage.setItem("vintage-ds-cart", JSON.stringify(items)) }, [items])

  const addToCart = (product) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id)
      if (found) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }
  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const changeQty = (id, delta) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, changeQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

function useToast() {
  const [msg, setMsg] = useState(null)
  const show = (text) => { setMsg(text); setTimeout(() => setMsg(null), 1800) }
  const Toast = () => msg ? <div className="toast">{msg}</div> : null
  return { show, Toast }
}
const ToastContext = createContext(null)

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}
function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal()
  return <div ref={ref} className={`reveal ${visible ? "reveal-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

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
      if (progress < 1) requestAnimationFrame(step); else setVal(end)
    }
    requestAnimationFrame(step)
  }, [visible])
  return <strong ref={ref}>{val}{suffix}</strong>
}

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

function PromoBar() {
  const text = "🚚 ສົ່ງທົ່ວປະເທດ　💯 ຂອງແທ້ 100%　🔄 ປ່ຽນໄດ້ຫາກສິນຄ້າບໍ່ຕົງປົກ　🔥 ອັບເດດສິນຄ້າໃໝ່ທຸກອາທິດ　"
  return <div className="promo-bar"><div className="marquee"><span>{text}{text}</span></div></div>
}

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { count } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  useEffect(() => {
    const onClickOutside = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false) }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const results = query.trim() ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.size.toLowerCase().includes(query.toLowerCase())) : []

  const links = [
    { to: "/", label: "ໜ້າຫຼັກ" },
    { to: "/categories", label: "ໝວດໝູ່" },
    { to: "/promotions", label: "ໂປຣໂມຊັນ" },
    { to: "/about", label: "ກ່ຽວກັບຮ້ານ" },
    { to: "/contact", label: "ຕິດຕໍ່ເຮົາ" },
  ]

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <Link to="/" className="navbar-logo">Vintage <span>DS</span></Link>
      <div className="navbar-search" ref={searchRef}>
        <input type="text" placeholder="🔍 ຄົ້ນຫາຊື່ ຫຼື ໄຊສ໌..." value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true) }} onFocus={() => setShowResults(true)} />
        {showResults && query.trim() && (
          <div className="search-dropdown">
            {results.length === 0 && <div className="search-empty">ບໍ່ພົບສິນຄ້າ</div>}
            {results.map((p) => (
              <div key={p.id} className="search-item" onClick={() => { navigate(`/product/${p.id}`); setQuery(""); setShowResults(false) }}>
                <img src={p.image} alt={p.name} />
                <div><p>{p.name}</p><span>ໄຊສ໌ {p.size} · {p.price.toLocaleString()} ກີບ</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="navbar-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={`nav-link ${location.pathname === link.to ? "active" : ""}`}>{link.label}</Link>
        ))}
        <Link to="/cart" className="cart-icon-link">🛒{count > 0 && <span className="cart-badge">{count}</span>}</Link>
      </div>
    </nav>
  )
}

function ProductCard({ product, index }) {
  const cardRef = useRef(null)
  const { addToCart } = useCart()
  const toast = useContext(ToastContext)
  const isSale = product.price <= SALE_MAX_PRICE

  const handleMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`)
    card.style.setProperty("--my", `${e.clientY - rect.top}px`)
  }

  return (
    <Link ref={cardRef} to={`/product/${product.id}`} className="product-card" style={{ animationDelay: `${index * 0.07}s` }} onMouseMove={handleMove}>
      <div className="card-glow"></div>
      <div className="product-img-wrap">
        <span className="category-chip" style={{ background: categoryColors[product.category] }}>{categoryLabels[product.category]}</span>
        {isSale && <span className="sale-chip">ລາຄາຍ່ອມ</span>}
        <img src={product.image} alt={product.name} />
        <button className="quick-add-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); Ripple(e); addToCart(product); toast?.show(`ໃສ່ '${product.name}' ໃນຕະກ້າແລ້ວ ✓`) }}>+ ໃສ່ຕະກ້າ</button>
      </div>
      <div className="product-card-info">
        <h3>{product.name}</h3>
        <div className="stars">★★★★★ <span className="size-chip">ໄຊສ໌ {product.size}</span></div>
        <p className="price-tag">ລາຄາ {product.price.toLocaleString()} ກີບ</p>
      </div>
    </Link>
  )
}

function BackToTop() {
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      setProgress((h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100)
      setShow(h.scrollTop > 400)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  const circumference = 2 * Math.PI * 18
  return (
    <button className={`back-to-top ${show ? "show" : ""}`} onClick={(e) => { Ripple(e); window.scrollTo({ top: 0, behavior: "smooth" }) }}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" className="progress-bg" />
        <circle cx="22" cy="22" r="18" className="progress-fg" strokeDasharray={circumference} strokeDashoffset={circumference - (progress / 100) * circumference} />
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
  const changeFilter = (key) => { setFilter(key); setAnimKey((k) => k + 1) }

  return (
    <div>
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-glow hero-glow-2"></div>
        <div className="hero-ring"></div>
        <div className="hero-particles">{Array.from({ length: 16 }).map((_, i) => <span key={i} className="particle" style={{ "--i": i }}></span>)}</div>
        <div className="hero-emojis">
          {["👕", "✨", "🧥", "🔥", "👟", "⭐"].map((e, i) => <span key={i} className="floaty-emoji" style={{ "--i": i }}>{e}</span>)}
        </div>

        <span className="hero-tagline-badge">🔥 ຂາຍເຄື່ອງມືສອງ</span>
        <img src="/images/logo.jpeg" alt="Vintage DS" className="hero-logo" />
        <h1 className="shop-title">Vintage DS</h1>
        <p className="shop-subtitle">ໄປອ່ານຄືນ ໄປຟັງຄືນ ອໍ້ແອ້ອ່ະ!!!</p>

        <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" className="follow-fb-btn" onClick={Ripple}>👍 ຕິດຕາມ Facebook Page</a>

        <div className="trust-badges">
          <div className="trust-badge"><CountUp end={products.length} suffix="+" /><span>ລາຍການສິນຄ້າ</span></div>
          <div className="trust-badge"><CountUp end={100} suffix="%" /><span>ຂອງແທ້</span></div>
          <div className="trust-badge"><CountUp end={24} suffix="ຊມ." /><span>ຕອບແຊັດໄວ</span></div>
        </div>
      </section>

      <div className="filter-bar">
        {Object.keys(categoryLabels).map((key) => (
          <button key={key} className={`filter-btn ${filter === key ? "active" : ""}`} onClick={(e) => { Ripple(e); changeFilter(key) }}>{categoryLabels[key]}</button>
        ))}
      </div>

      <Reveal><div className="section-label"><h2>ສິນຄ້າແນະນຳ</h2><span>{filteredProducts.length} ລາຍການ</span></div></Reveal>

      <div className="product-grid" key={animKey}>
        {filteredProducts.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
      </div>

      <Reveal>
        <section className="why-us">
          <div className="why-us-item"><div className="why-us-icon">🧵</div><h4>ຄັດເລືອກມືສອງແທ້</h4><p>ທຸກຕົວກວດເຊັກສະພາບກ່ອນລົງຂາຍ</p></div>
          <div className="why-us-item"><div className="why-us-icon">⚡</div><h4>ອັບເດດໄວ</h4><p>ສິນຄ້າໃໝ່ທຸກອາທິດ ຕິດຕາມໄດ້ເລີຍ</p></div>
          <div className="why-us-item"><div className="why-us-icon">🤝</div><h4>ລາຄາຍຸດຕິທຳ</h4><p>ຄຸ້ມຄ່າ ສະພາບດີ ລາຄາເປັນກັນເອງ</p></div>
        </section>
      </Reveal>

      <Reveal>
        <section className="testimonials">
          <h2>ລູກຄ້າເວົ້າວ່າແນວໃດ</h2>
          <div className="testimonial-grid">
            {reviewsData.slice(0, 3).map((t, i) => (
              <div className="testimonial-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stars">★★★★★</div><p>"{t.text}"</p><span className="testimonial-name">— {t.name}</span>
              </div>
            ))}
          </div>
          <Link to="/reviews" className="view-all-link">ເບິ່ງລີວິວທັງໝົດ →</Link>
        </section>
      </Reveal>

      <Reveal>
        <section className="newsletter">
          <h3>ຢາກໄດ້ຂອງໃໝ່ກ່ອນໃຜ?</h3>
          <p>ທັກ Facebook ໄວ້ ເພື່ອຮັບແຈ້ງເຕືອນເມື່ອມີສິນຄ້າໃໝ່</p>
          <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" className="newsletter-btn" onClick={Ripple}>ທັກ Facebook ເລີຍ →</a>
        </section>
      </Reveal>
    </div>
  )
}

/* ===== Product Detail ===== */
function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find((p) => p.id === parseInt(id))
  const [activeImg, setActiveImg] = useState(0)
  const imgRef = useRef(null)
  const { addToCart } = useCart()
  const toast = useContext(ToastContext)
  const [copied, setCopied] = useState(false)

  if (!product) return <p style={{ padding: "40px", textAlign: "center" }}>ไม่พบสินค้า</p>

  const pageUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleZoom = (e) => {
    const img = imgRef.current
    if (!img) return
    const rect = img.getBoundingClientRect()
    img.style.transformOrigin = `${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%`
  }
  const copyLink = () => { navigator.clipboard?.writeText(pageUrl); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  const shareFb = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, "_blank")
  const shareLine = () => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}`, "_blank")

  return (
    <div className="detail-page">
      <div className="breadcrumb"><Link to="/">ໜ້າຫຼັກ</Link> / <span>{product.name}</span></div>
      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-main-img" onMouseMove={handleZoom} onMouseLeave={() => { if (imgRef.current) imgRef.current.style.transformOrigin = "center" }}>
            <img ref={imgRef} key={activeImg} src={product.images[activeImg]} alt={product.name} className="zoom-img" />
          </div>
          <div className="detail-thumbs">
            {product.images.map((img, i) => <img key={i} src={img} alt={`${product.name} ${i + 1}`} className={`thumb ${activeImg === i ? "active" : ""}`} onClick={() => setActiveImg(i)} />)}
          </div>
        </div>
        <div className="detail-info">
          <div className="detail-chips">
            <span className="category-chip" style={{ background: categoryColors[product.category], position: "static" }}>{categoryLabels[product.category]}</span>
            <span className="size-chip size-chip-lg">ໄຊສ໌ {product.size}</span>
          </div>
          <h1>{product.name}</h1>
          <div className="stars detail-stars">★★★★★ <span>(5.0)</span></div>
          <p className="detail-price">{product.price.toLocaleString()} ກີບ</p>
          <p className="detail-desc">{product.detail}</p>

          <div className="detail-actions">
            <button className="buy-btn-outline" onClick={(e) => { Ripple(e); addToCart(product); toast?.show("ໃສ່ຕະກ້າແລ້ວ ✓") }}>🛒 ໃສ່ຕະກ້າ</button>
            <button className="buy-btn" onClick={(e) => { Ripple(e); navigate("/checkout", { state: { buyNow: product } }) }}>⚡ ສັ່ງຊື້ເລີຍ</button>
          </div>

          <div className="share-row">
            <span>ແຊຣ໌:</span>
            <button className="share-btn fb" onClick={shareFb}>f</button>
            <button className="share-btn line" onClick={shareLine}>LINE</button>
            <button className="share-btn copy" onClick={copyLink}>{copied ? "✓ ກອບປີ້ແລ້ວ" : "🔗 ກອບປີ້ລິ້ງ"}</button>
          </div>
          <Link to="/" className="back-link">← ກັບໄປໜ້າຫຼັກ</Link>
        </div>
      </div>
      <div className="sticky-buy-bar">
        <div><strong>{product.price.toLocaleString()} ກີບ</strong><span>{product.name}</span></div>
        <button onClick={(e) => { Ripple(e); navigate("/checkout", { state: { buyNow: product } }) }}>ສັ່ງຊື້ເລີຍ</button>
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
      <section className="page-hero"><h1>ໝວດໝູ່ສິນຄ້າ</h1><p>ເລືອກເບິ່ງສິນຄ້າຕາມປະເພດທີ່ທ່ານມັກ</p></section>
      <div className="filter-bar">
        {Object.keys(categoryLabels).map((key) => <button key={key} className={`filter-btn ${filter === key ? "active" : ""}`} onClick={(e) => { Ripple(e); setFilter(key) }}>{categoryLabels[key]}</button>)}
      </div>
      <div className="product-grid" key={filter}>{filteredProducts.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}</div>
    </div>
  )
}

function Promotions() {
  const saleProducts = products.filter((p) => p.price <= SALE_MAX_PRICE)
  return (
    <div>
      <section className="page-hero promo-hero"><h1>🏷️ ໂປຣໂມຊັນ / ລາຄາຍ່ອມເຍົາ</h1><p>ລວມສິນຄ້າລາຄາເບົາ ຄຸ້ມຄ່າ ຄັດມາໃຫ້ແລ້ວ</p></section>
      <div className="section-label"><h2>ສິນຄ້າລາຄາຍ່ອມ</h2><span>{saleProducts.length} ລາຍການ</span></div>
      <div className="product-grid">{saleProducts.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}</div>
    </div>
  )
}

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <div>
      <section className="page-hero"><h1>❓ ຄຳຖາມທີ່ພົບເລື້ອຍ</h1><p>ຄຳຕອບຄຳຖາມທີ່ລູກຄ້າຖາມເລື້ອຍໆ</p></section>
      <div className="faq-list">
        {faqData.map((item, i) => (
          <Reveal key={i} delay={i * 60}>
            <div className={`faq-item ${open === i ? "open" : ""}`} onClick={() => setOpen(open === i ? null : i)}>
              <div className="faq-question"><span>{item.q}</span><span className="faq-arrow">⌄</span></div>
              <div className="faq-answer"><p>{item.a}</p></div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function Reviews() {
  return (
    <div>
      <section className="page-hero"><h1>⭐ ລີວິວຈາກລູກຄ້າ</h1><p>ຄວາມຄິດເຫັນຈິງຈາກຄົນທີ່ອຸດໜູນ</p></section>
      <div className="testimonial-grid reviews-page-grid">
        {reviewsData.map((t, i) => (
          <Reveal key={i} delay={i * 60}>
            <div className="testimonial-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="stars">★★★★★</div><p>"{t.text}"</p><span className="testimonial-name">— {t.name}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ===== Cart Page ===== */
function CartPage() {
  const { items, removeFromCart, changeQty, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>ຕະກ້າຂອງທ່ານຍັງວ່າງ</h2>
        <p>ເລືອກຊື້ສິນຄ້າແລ້ວກັບມາເບິ່ງທີ່ນີ້ໄດ້ເລີຍ</p>
        <Link to="/" className="buy-btn">ໄປເລືອກຊື້ສິນຄ້າ</Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>🛒 ຕະກ້າສິນຄ້າ</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <span className="size-chip">ໄຊສ໌ {item.size}</span>
              <p className="price-tag">{item.price.toLocaleString()} ກີບ</p>
            </div>
            <div className="qty-stepper">
              <button onClick={() => changeQty(item.id, -1)}>−</button>
              <span>{item.qty}</span>
              <button onClick={() => changeQty(item.id, 1)}>+</button>
            </div>
            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>🗑️</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total"><span>ລວມທັງໝົດ</span><strong>{total.toLocaleString()} ກີບ</strong></div>
        <button className="buy-btn" onClick={(e) => { Ripple(e); navigate("/checkout") }}>💳 ຊຳລະເງິນ</button>
      </div>
    </div>
  )
}

/* ===== Checkout Page ===== */
function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { items: cartItems, total: cartTotal, clearCart } = useCart()
  const buyNow = location.state?.buyNow

  const checkoutItems = buyNow ? [{ ...buyNow, qty: 1 }] : cartItems
  const checkoutTotal = buyNow ? buyNow.price : cartTotal

  const [form, setForm] = useState({ name: "", address: "", phone: "" })
  const [errors, setErrors] = useState({})

  if (checkoutItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🧾</div>
        <h2>ຍັງບໍ່ມີສິນຄ້າໃຫ້ຊຳລະເງິນ</h2>
        <Link to="/" className="buy-btn">ໄປເລືອກຊື້ສິນຄ້າ</Link>
      </div>
    )
  }

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const buildOrderText = () => {
    let text = "📦 ສະຫຼຸບອໍເດີ Vintage DS\n\n"
    checkoutItems.forEach((i) => { text += `- ${i.name} (ໄຊສ໌ ${i.size}) x${i.qty} = ${(i.price * i.qty).toLocaleString()} ກີບ\n` })
    text += `\nລວມທັງໝົດ: ${checkoutTotal.toLocaleString()} ກີບ\n\n`
    text += `👤 ຊື່: ${form.name}\n📍 ທີ່ຢູ່: ${form.address}\n📞 ເບີໂທ: ${form.phone}`
    return text
  }

  const handleConfirm = (e) => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "ກະລຸນາໃສ່ຊື່"
    if (!form.address.trim()) newErrors.address = "ກະລຸນາໃສ່ທີ່ຢູ່"
    if (!form.phone.trim()) newErrors.phone = "ກະລຸນາໃສ່ເບີໂທ"
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    Ripple(e)
    navigator.clipboard?.writeText(buildOrderText())
    if (!buyNow) clearCart()
    navigate("/thank-you", { state: { orderText: buildOrderText(), total: checkoutTotal } })
  }

  return (
    <div className="checkout-page">
      <div className="breadcrumb"><Link to="/">ໜ້າຫຼັກ</Link> / <span>ຊຳລະເງິນ</span></div>
      <h1>💳 ຊຳລະເງິນ</h1>

      <div className="checkout-layout">
        <div className="checkout-left">
          <Reveal>
            <div className="checkout-card">
              <h3>📋 ລາຍການສິນຄ້າ</h3>
              {checkoutItems.map((item) => (
                <div className="checkout-line" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-line-info">
                    <p>{item.name}</p>
                    <span>ໄຊສ໌ {item.size} × {item.qty}</span>
                  </div>
                  <strong>{(item.price * item.qty).toLocaleString()} ກີບ</strong>
                </div>
              ))}
              <div className="checkout-total-row"><span>ລວມທັງໝົດ</span><strong>{checkoutTotal.toLocaleString()} ກີບ</strong></div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="checkout-card qr-card">
              <h3>📱 ສະແກນ QR ເພື່ອໂອນເງິນ</h3>
              <div className="qr-amount">ຍອດທີ່ຕ້ອງໂອນ: <strong>{checkoutTotal.toLocaleString()} ກີບ</strong></div>
              <div className="qr-frame">
                <img src="/images/QR.jpeg" alt="QR ຊຳລະເງິນ" onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex" }} />
                <div className="qr-placeholder" style={{ display: "none" }}>ວາງຮູບ QR.jpeg ໄວ້ທີ່ public/images/</div>
              </div>
              <p className="qr-hint">ຫຼັງໂອນແລ້ວ ຢ່າລືມແນບສະລິບໃນ Facebook ດ້ວຍ</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="checkout-card checkout-form">
            <h3>📝 ຂໍ້ມູນຈັດສົ່ງ</h3>
            <label>ຊື່-ນາມສະກຸນ</label>
            <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="ຊື່ຜູ້ຮັບ" className={errors.name ? "input-error" : ""} />
            {errors.name && <span className="field-error">{errors.name}</span>}

            <label>ທີ່ຢູ່ຈັດສົ່ງ</label>
            <textarea rows="3" value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="ບ້ານເລກທີ ໝູ່ ບ້ານ ເມືອງ ແຂວງ" className={errors.address ? "input-error" : ""}></textarea>
            {errors.address && <span className="field-error">{errors.address}</span>}

            <label>ເບີໂທຕິດຕໍ່</label>
            <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="020 xxxx xxxx" className={errors.phone ? "input-error" : ""} />
            {errors.phone && <span className="field-error">{errors.phone}</span>}

            <button className="buy-btn confirm-btn" onClick={handleConfirm}>✅ ຢືນຢັນການສັ່ງຊື້</button>
            <p className="cart-hint">ຂໍ້ມູນຈະຖືກກອບປີ້ໄວ້ ໃຫ້ວາງສົ່ງທາງ Facebook ໃນຂັ້ນຕອນຕໍ່ໄປ</p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

/* ===== Thank You Page ===== */
function ThankYou() {
  const location = useLocation()
  const total = location.state?.total

  return (
    <div className="thankyou-page">
      <div className="thankyou-check">
        <svg viewBox="0 0 52 52"><circle className="check-circle" cx="26" cy="26" r="24" /><path className="check-mark" d="M14 27l7 7 17-17" /></svg>
      </div>
      <h1>ຂອບໃຈສຳລັບການສັ່ງຊື້! 🎉</h1>
      <p>ຂໍ້ມູນອໍເດີຖືກກອບປີ້ໄວ້ໃນຄລິບບອດແລ້ວ ກົດປຸ່ມລຸ່ມນີ້ເພື່ອເປີດ Facebook ແລ້ວວາງ (paste) ສົ່ງອໍເດີ ພ້ອມແນບສະລິບໂອນເງິນ</p>
      {total && <div className="thankyou-total">ຍອດລວມ: <strong>{total.toLocaleString()} ກີບ</strong></div>}
      <div className="thankyou-actions">
        <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" className="buy-btn" onClick={Ripple}>ເປີດ Facebook ເພື່ອວາງສົ່ງ →</a>
        <Link to="/" className="buy-btn-outline">ກັບໄປໜ້າຫຼັກ</Link>
      </div>
    </div>
  )
}

function About() {
  return (
    <div>
      <section className="page-hero"><h1>ກ່ຽວກັບ Vintage DS</h1><p>ເສື້ອຜ້າມືສອງ ສະພາບດີ ລາຄາເປັນກັນເອງ</p></section>
      <div className="about-grid">
        {[
          { icon: "🎯", title: "ພາລະກິດຂອງພວກເຮົາ", text: "ຄັດເລືອກເສື້ອຜ້າມືສອງແທ້ຄຸນນະພາບດີ ນຳມາໃຫ້ລູກຄ້າໃນລາຄາທີ່ເຂົ້າເຖິງໄດ້ງ່າຍ." },
          { icon: "✅", title: "ຄວາມໜ້າເຊື່ອຖື", text: "ທຸກຕົວກວດເຊັກສະພາບກ່ອນລົງຂາຍ ບໍ່ມີການປິດບັງຕຳນິ." },
          { icon: "💬", title: "ບໍລິການລູກຄ້າ", text: "ຕອບແຊັດໄວ ພ້ອມໃຫ້ຄຳປຶກສາເລືອກໄຊສ໌ ແລະ ສະໄຕລ໌." },
        ].map((c, i) => (
          <Reveal key={i} delay={i * 100}><div className="about-card"><div className="about-icon">{c.icon}</div><h3>{c.title}</h3><p>{c.text}</p></div></Reveal>
        ))}
      </div>
    </div>
  )
}

function Contact() {
  return (
    <div>
      <section className="page-hero"><h1>ຕິດຕໍ່ເຮົາ</h1><p>ມີຄຳຖາມ ຫຼື ຢາກສັ່ງຊື້? ທັກຫາພວກເຮົາໄດ້ເລີຍ</p></section>
      <Reveal>
        <div className="contact-card">
          <div className="contact-icon">📩</div><h3>Facebook Page</h3><p>ຊ່ອງທາງຫຼັກໃນການສັ່ງຊື້ ແລະ ສອບຖາມສິນຄ້າ</p>
          <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" className="buy-btn" onClick={Ripple}>ທັກ Facebook ເລີຍ</a>
        </div>
      </Reveal>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div><h4 className="footer-logo">Vintage DS</h4><p>ເສື້ອຜ້າມືສອງ ສະພາບດີ ລາຄາເປັນກັນເອງ</p></div>
        <div><h5>ໝວດໝູ່</h5><ul><li><Link to="/categories">Hoodie</Link></li><li><Link to="/categories">Polo</Link></li><li><Link to="/categories">Premium</Link></li></ul></div>
        <div><h5>ລິ້ງດ່ວນ</h5><ul><li><Link to="/promotions">ໂປຣໂມຊັນ</Link></li><li><Link to="/faq">FAQ</Link></li><li><Link to="/reviews">ລີວິວ</Link></li></ul></div>
        <div><h5>ຕິດຕໍ່</h5><a href={FB_PAGE} target="_blank" rel="noopener noreferrer">Facebook Page</a></div>
      </div>
      <div className="footer-bottom">© 2026 Vintage DS. All rights reserved.</div>
    </footer>
  )
}

function AppContent() {
  const toast = useToast()
  return (
    <ToastContext.Provider value={toast}>
      <PromoBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <BackToTop />
      <toast.Toast />
    </ToastContext.Provider>
  )
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

export default App