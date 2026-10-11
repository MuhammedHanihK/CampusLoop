import { useState } from "react";

const categories = ["Books", "Electronics", "Calculators", "Lab Equipment", "Stationery", "Other"];
const conditions = ["New", "Like New", "Good", "Fair"];

export default function ProductForm({ initial = {}, onSubmit, submitText = "Publish listing" }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    price: initial.price ?? "",
    category: initial.category || "Books",
    condition: initial.condition || "Good",
    imageUrl: initial.imageUrl || "",
    contact: initial.contact || ""
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSubmit({ ...form, price: Number(form.price) });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <label>Item title<input name="title" value={form.title} onChange={change} required maxLength="100" placeholder="e.g. Engineering Mathematics textbook" /></label>
      <div className="form-row">
        <label>Price (₹)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required /></label>
        <label>Category<select name="category" value={form.category} onChange={change}>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="form-row">
        <label>Condition<select name="condition" value={form.condition} onChange={change}>{conditions.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Contact email or phone<input name="contact" value={form.contact} onChange={change} required maxLength="100" placeholder="How buyers can reach you" /></label>
      </div>
      <label>Image URL <span className="optional">(optional)</span><input name="imageUrl" type="url" value={form.imageUrl} onChange={change} placeholder="https://example.com/item.jpg" /></label>
      <label>Description<textarea name="description" value={form.description} onChange={change} required rows="5" maxLength="1500" placeholder="Describe the item, its age and any defects..." /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="button" disabled={busy}>{busy ? "Saving..." : submitText}</button>
    </form>
  );
}
