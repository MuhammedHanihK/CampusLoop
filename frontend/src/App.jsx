import { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductForm from "./components/ProductForm";
import { request } from "./api";

const categories = ["All", "Books", "Electronics", "Calculators", "Lab Equipment", "Stationery", "Other"];

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ search, category, status: "Available" });
      setProducts(await request(`/products?${params}`));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 250);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="live-dot" /> THE STUDENT MARKETPLACE</span>
          <h1>Good things deserve<br /><em>a second life.</em></h1>
          <p>Find affordable campus essentials. Give your unused books, gadgets and gear a new home.</p>
          <a className="button hero-button" href="#market">Explore listings <span>↘</span></a>
          <div className="hero-note"><span className="avatar-stack">✦</span> Made for students, by students.</div>
        </div>
        <div className="hero-art">
          <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
          <div className="art-card art-book"><span>READ<br />AGAIN.</span><small>Knowledge goes around.</small><b>↗</b></div>
          <div className="art-card art-calculator"><span>⌗</span><small>CALCULATOR</small></div>
          <div className="art-sticker">LESS WASTE<br />MORE VALUE <span>↗</span></div>
          <div className="art-spark">✳</div>
        </div>
      </section>

      <section className="trust-strip">
        <div><span>↗</span><p><b>Student-friendly prices</b><small>Save on everyday essentials</small></p></div>
        <div><span>⟳</span><p><b>Give items a second life</b><small>Reuse more, waste less</small></p></div>
        <div><span>⌖</span><p><b>Meet on campus</b><small>Arrange a convenient exchange</small></p></div>
      </section>

      <section className="market-section" id="market">
        <div className="section-heading"><div><span className="eyebrow">THE MARKETPLACE</span><h2>Find your next <em>favourite.</em></h2></div><span className="listing-count">{products.length} items found</span></div>
        <div className="market-tools">
          <div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books, gadgets, calculators..." /></div>
          <div className="category-list">{categories.map(item => <button key={item} className={`category-chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
        </div>
        {error && <div className="notice error">{error}<button onClick={loadProducts}>Retry</button></div>}
        {loading ? <p className="empty-state">Loading listings...</p> : products.length ? (
          <div className="product-grid">{products.map(product => <ProductCard key={product._id} product={product} />)}</div>
        ) : (
          <div className="empty-state"><span>◌</span><h3>No listings yet</h3><p>Be the first to give something a second life.</p><Link className="button" to="/sell">List an item</Link></div>
        )}
      </section>
      <section className="sell-banner"><div><span className="eyebrow">YOUR SHELF, SOMEONE'S TREASURE</span><h2>Not using it anymore?<br /><em>Pass it on.</em></h2></div><Link className="button button-light" to="/sell">Sell an item <span>↗</span></Link><span className="banner-star">✳</span></section>
    </>
  );
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await request(`/auth/${mode}`, { method: "POST", body: JSON.stringify(form) });
      localStorage.setItem("campusloop_token", data.token);
      onAuth(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-shell auth-shell">
      <div className="auth-intro"><span className="eyebrow">WELCOME TO CAMPUSLOOP</span><h1>{isRegister ? <>Your campus.<br /><em>Your community.</em></> : <>Good to have<br /><em>you back.</em></>}</h1><p>Buy less new. Find more useful. Keep good things moving.</p><div className="auth-illustration">C<span>↗</span></div></div>
      <form className="form-card auth-card" onSubmit={submit}>
        <h2>{isRegister ? "Create your account" : "Log in"}</h2><p className="muted">{isRegister ? "Join your campus marketplace." : "Continue to your campus marketplace."}</p>
        {isRegister && <label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength="80" /></label>}
        <label>Email address<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Password<input type="password" minLength="6" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="button button-full" disabled={busy}>{busy ? "Please wait..." : isRegister ? "Create account" : "Log in"}</button>
        <p className="auth-switch">{isRegister ? "Already a member?" : "New to CampusLoop?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link></p>
      </form>
    </section>
  );
}

function SellPage({ user }) {
  const navigate = useNavigate();
  if (!user) return <section className="page-shell"><div className="notice">Please <Link to="/login">log in</Link> to publish an item.</div></section>;
  return <section className="page-shell narrow-page"><span className="eyebrow">PASS IT ON</span><h1>List an <em>item.</em></h1><p className="muted">Add clear details so another student knows exactly what they're getting.</p><ProductForm onSubmit={async data => { await request("/products", { method: "POST", body: JSON.stringify(data) }); navigate("/my-listings"); }} /></section>;
}

function DetailsPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    request(`/products/${id}`).then(setProduct).catch(err => setError(err.message));
  }, [id]);

  async function update(status) {
    setBusy(true);
    try {
      const changed = await request(`/products/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
      setProduct(changed);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!window.confirm("Delete this listing permanently?")) return;
    setBusy(true);
    try { await request(`/products/${id}`, { method: "DELETE" }); navigate("/my-listings"); }
    catch (err) { setError(err.message); setBusy(false); }
  }

  if (error && !product) return <section className="page-shell"><div className="notice error">{error}</div></section>;
  if (!product) return <section className="page-shell">Loading product...</section>;

  const own = user && product.seller?._id === user.id;
  return (
    <section className="page-shell detail-layout">
      <div><img className="detail-image" src={product.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80"} alt={product.title} /></div>
      <div className="detail-info"><span className="eyebrow">{product.category} · {product.condition}</span><h1>{product.title}</h1><div className="detail-price">₹{Number(product.price).toLocaleString("en-IN")}</div><p className="detail-description">{product.description}</p><div className="seller-panel"><span className="seller-avatar">{product.seller?.name?.[0] || "S"}</span><div><small>LISTED BY</small><b>{product.seller?.name || "Campus seller"}</b><span>{product.status}</span></div></div>
        {product.status === "Available" && !own && <a className="button button-full" href={`mailto:${product.seller?.email || ""}?subject=${encodeURIComponent("CampusLoop enquiry: " + product.title)}`}>Contact seller ↗</a>}
        {own && <div className="owner-actions">{product.status === "Available" ? <button className="button" disabled={busy} onClick={() => update("Sold")}>Mark as sold</button> : <button className="button" disabled={busy} onClick={() => update("Available")}>Mark available</button>}<button className="button button-danger" disabled={busy} onClick={remove}>Delete listing</button></div>}
        {error && <p className="form-error">{error}</p>}<Link className="back-link" to="/">← Back to marketplace</Link>
      </div>
    </section>
  );
}

function MyListings({ user }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (user) request("/products/my/listings").then(setProducts).catch(err => setError(err.message));
  }, [user, refresh]);

  if (!user) return <section className="page-shell"><div className="notice">Please <Link to="/login">log in</Link> to view your listings.</div></section>;
  return <section className="page-shell"><div className="section-heading"><div><span className="eyebrow">YOUR MARKETPLACE</span><h1>My <em>listings.</em></h1></div><Link className="button" to="/sell">+ Sell item</Link></div>
    {error && <div className="notice error">{error}</div>}
    {products.length ? <div className="product-grid">{products.map(product => <div key={product._id}><ProductCard product={product} /><div className="listing-actions"><Link to={`/product/${product._id}`}>View / manage listing ↗</Link><button onClick={() => setRefresh(x => x + 1)}>Refresh</button></div></div>)}</div> : !error && <div className="empty-state"><h3>You haven't listed anything yet.</h3><p>List your first item and help another student save.</p><Link className="button" to="/sell">Sell an item</Link></div>}
  </section>;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("campusloop_token");
    if (!token) { setChecking(false); return; }
    request("/auth/me").then(data => setUser(data.user)).catch(() => localStorage.removeItem("campusloop_token")).finally(() => setChecking(false));
  }, []);

  function logout() {
    localStorage.removeItem("campusloop_token");
    setUser(null);
  }

  if (checking) return <div className="startup-loading">CampusLoop<span>✳</span></div>;

  return <div className="app"><Navbar user={user} onLogout={logout} /><main><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<AuthPage mode="login" onAuth={setUser} />} />
    <Route path="/register" element={<AuthPage mode="register" onAuth={setUser} />} />
    <Route path="/sell" element={<SellPage user={user} />} />
    <Route path="/product/:id" element={<DetailsPage user={user} />} />
    <Route path="/my-listings" element={<MyListings user={user} />} />
    <Route path="*" element={<section className="page-shell"><h1>Page not found</h1><Link to="/">Go home</Link></section>} />
  </Routes></main><footer className="footer"><Link className="brand" to="/"><span className="brand-mark">C</span> CampusLoop</Link><span>Good things deserve a second life.</span><span>Made for campus communities · © 2026</span></footer></div>;
}
