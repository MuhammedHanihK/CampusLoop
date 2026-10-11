import { Link } from "react-router-dom";

const fallback = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link className="product-image-wrap" to={`/product/${product._id}`}>
        <img
          className="product-image"
          src={product.imageUrl || fallback}
          alt={product.title}
          onError={event => { event.currentTarget.src = fallback; }}
        />
        <span className={`status-pill ${product.status === "Sold" ? "sold" : ""}`}>{product.status}</span>
      </Link>
      <div className="product-info">
        <div className="product-meta"><span>{product.category}</span><span>{product.condition}</span></div>
        <Link className="product-title" to={`/product/${product._id}`}>{product.title}</Link>
        <div className="product-bottom">
          <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
          <span className="seller-name">{product.seller?.name || "Campus seller"}</span>
        </div>
      </div>
    </article>
  );
}
