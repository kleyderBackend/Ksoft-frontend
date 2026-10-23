import styles from "./FormContact.module.css";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "../../config/contact";
import { FaArrowRight, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const topics = ["Proyecto a medida", "Producto SaaS", "Otra consulta"];

export const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [topic, setTopic] = useState(topics[0]);
  const submitting = useRef(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const messageInput = useRef<HTMLTextAreaElement>(null);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Escribe tu nombre.";
    if (!form.email.trim()) e.email = "Escribe tu correo electrónico.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Escribe un correo electrónico válido.";
    if (!form.message.trim()) e.message = "Cuéntanos un poco más.";
    return e;
  }, [form]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((s) => ({ ...s, [field]: value }));
    setStatus("idle");
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submitting.current) return;
    setTouched(true);
    if (Object.keys(errors).length > 0) {
      (errors.name ? nameInput : errors.email ? emailInput : messageInput).current?.focus();
      return;
    }
    submitting.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), message: `Motivo: ${topic}\n\n${form.message.trim()}` }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error("Unconfirmed submission");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTopic(topics[0]);
      setTouched(false);
    } catch {
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  };

  return (
    <form id="contact-form" className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={status === "sending"} aria-labelledby="form-title">
      <header>
        <p className={styles.eyebrow}>CUÉNTANOS TU IDEA</p>
        <h2 id="form-title" className={styles.title}>¿Qué tienes en mente?</h2>
        <p className={styles.intro}>Completa el formulario para que podamos conocer tu necesidad. Todos los campos son obligatorios.</p>
      </header>
      <fieldset className={styles.topics} disabled={status === "sending"}>
        <legend>¿Sobre qué quieres hablar?</legend>
        <div className={styles.topicOptions}>
          {topics.map((option) => (
            <label key={option} className={styles.topicOption}>
              <input type="radio" name="topic" value={option} checked={topic === option} onChange={() => { setTopic(option); setStatus("idle"); }} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className={styles.field}>
        <label htmlFor="contact-name">Nombre</label>
        <input ref={nameInput} id="contact-name" name="name" type="text" autoComplete="name" required maxLength={120}
          placeholder="Tu nombre" value={form.name} disabled={status === "sending"}
          onChange={(e) => update("name", e.target.value)} aria-invalid={touched && !!errors.name}
          aria-describedby={touched && errors.name ? "name-error" : undefined} />
        {touched && errors.name && <div id="name-error" className={styles.error}>{errors.name}</div>}
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-email">Correo electrónico</label>
        <input ref={emailInput} id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254}
          placeholder="tu@email.com" value={form.email} disabled={status === "sending"}
          onChange={(e) => update("email", e.target.value)} aria-invalid={touched && !!errors.email}
          aria-describedby={touched && errors.email ? "email-error" : undefined} />
        {touched && errors.email && <div id="email-error" className={styles.error}>{errors.email}</div>}
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">Mensaje</label>
        <textarea ref={messageInput} id="contact-message" name="message" required maxLength={4900}
          placeholder={topic === "Producto SaaS" ? "¿Qué producto te interesa y qué te gustaría conocer?" : "Cuéntanos sobre tu negocio y qué necesitas resolver..."} value={form.message} disabled={status === "sending"}
          onChange={(e) => update("message", e.target.value)} aria-invalid={touched && !!errors.message}
          aria-describedby={touched && errors.message ? "message-error" : undefined} />
        {touched && errors.message && <div id="message-error" className={styles.error}>{errors.message}</div>}
      </div>
      <p className={styles.notice}>Usaremos tus datos para atender tu solicitud. Consulta nuestra <Link to="/privacity">política de privacidad</Link>.</p>
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando..." : "Enviar mensaje"}<FaArrowRight aria-hidden="true" /></button>
      <div aria-live="polite" aria-atomic="true">
        {status === "sent" && <p className={styles.success}><FaCheckCircle aria-hidden="true" />Recibimos tu mensaje. Gracias por contactar con Ksoft.</p>}
        {status === "error" && <p className={styles.submitError}><FaExclamationCircle aria-hidden="true" />No pudimos confirmar la recepción de tu mensaje. Conservamos lo que escribiste. Puedes contactarnos en <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>}
      </div>
    </form>
  );
};
