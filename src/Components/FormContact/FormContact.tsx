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

  return (
    <form
      className={styles.form}
      onSubmit={(ev) => {
        ev.preventDefault();
        setTouched(true);
        if (Object.keys(errors).length > 0) return;
        setStatus("sending");
        // Simulación de envío (sin backend)
        window.setTimeout(() => {
          setStatus("sent");
          setForm({ name: "", email: "", message: "" });
          setTouched(false);
        }, 650);
      }}
    >
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
