import styles from "./FormContact.module.css";
import { useMemo, useState } from "react";

export const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Escribí tu nombre.";
    if (!form.email.trim()) e.email = "Escribí tu email.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Email inválido.";
    if (!form.message.trim()) e.message = "Contanos un poco más.";
    return e;
  }, [form]);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length > 0) return;

    setStatus("sending");

    const body = new URLSearchParams({
      name: form.name,
      email: form.email,
      message: form.message,
    });

    try {
      await fetch("https://script.google.com/macros/s/AKfycbxrFoiixnTV8Hye1VtXStXxeoEwKBqSJ_5O1T-tOZdnIBBpuz6sPU6QVLak6OpMTPZbQw/exec", {
        method: "POST",
        body: body,
      });

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTouched(false);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Hubo un error, intenta de nuevo.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.title}>Envíanos un Mensaje</h3>

      <div className={styles.field}>
        <label>Nombre</label>
        <input
          type="text"
          placeholder="Tu nombre"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          aria-invalid={touched && !!errors.name}
        />
        {touched && errors.name ? (
          <div className={styles.error}>{errors.name}</div>
        ) : null}
      </div>

      <div className={styles.field}>
        <label>Email</label>
        <input
          type="email"
          placeholder="tu@email.com"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          aria-invalid={touched && !!errors.email}
        />
        {touched && errors.email ? (
          <div className={styles.error}>{errors.email}</div>
        ) : null}
      </div>

      <div className={styles.field}>
        <label>Mensaje</label>
        <textarea
          placeholder="Cuéntanos qué necesitas..."
          value={form.message}
          onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
          aria-invalid={touched && !!errors.message}
        />
        {touched && errors.message ? (
          <div className={styles.error}>{errors.message}</div>
        ) : null}
      </div>

      <button type="submit" disabled={status === "sending"}>
        {status === "sending"
          ? "Enviando..."
          : status === "sent"
            ? "Enviado"
            : "Enviar mensaje"}
      </button>

      {status === "sent" ? (
        <div className={styles.success}>
          Gracias. Te respondemos a la brevedad.
        </div>
      ) : null}
    </form>
  );
};
