import { useState } from "react";
import { Link } from "react-router-dom";
import { useUnsavedChanges } from "../../useUnsavedChanges";
import type { FormEvent } from "react";
import { useAdmin } from "../../AdminContext";
import { parseAdminData } from "../../adminModel";
import styles from "./SettingsManager.module.css";
import { CloudSettings } from "./CloudSettings";

export function SettingsManager() {
  const { data, save,cloud } = useAdmin();
  const [form, setForm] = useState(data.workspace.settings);
  useUnsavedChanges(JSON.stringify(form)!==JSON.stringify(data.workspace.settings));
  const [error, setError] = useState(""),
    [importing, setImporting] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.company.trim() || !form.owner.trim()) {
      setError("Completa el nombre de la empresa y del responsable.");
      return;
    }
    const saved=await save(
      {
        ...data,
        workspace: {
          ...data.workspace,
          settings: {
            ...form,
            company: form.company.trim(),
            owner: form.owner.trim(),
            email: form.email.trim(),
          },
        },
      },
      "Configuración actualizada",
    );
    if(saved){setForm({...form,company:form.company.trim(),owner:form.owner.trim(),email:form.email.trim()});setError("");}
  };
  const restore = async (file?: File) => {
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      setError("El respaldo supera el límite de 6 MB.");
      return;
    }
    setImporting(true);
    setError("");
    try {
      const next = parseAdminData(await file.text());
      if (
        window.confirm(
          "¿Reemplazar los registros del panel con este respaldo? Exporta primero una copia si necesitas conservar el contenido actual.",
        )
      ) {
        if (await save(next, "Respaldo restaurado", true, {restoreBackup:true})) setForm(next.workspace.settings);
      }
    } catch {
      setError(
        "No se pudo importar. Selecciona un respaldo JSON válido exportado desde este panel.",
      );
    } finally {
      setImporting(false);
    }
  };
  return (
    <>
      <div className={styles.container}>
        <CloudSettings/>
        <form className={styles.panel} onSubmit={submit}>
          <h2>Datos de la empresa</h2>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              Empresa
              <input
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Responsable
              <input
                required
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Correo de contacto
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Moneda
              <input readOnly value="Peso colombiano (COP)" />
            </label>
          </div>
          <small>
            Estos datos se utilizan dentro del panel y en la impresión de
            cotizaciones.
          </small>
          <div>
            <button className={styles.primary}>Guardar configuración</button>
          </div>
        </form>
        <section className={styles.panel}>
          <h2>Respaldo y restauración</h2>
          <p className={styles.count}>Tamaño aproximado del respaldo: {(new Blob([JSON.stringify(data)]).size/1024).toLocaleString("es-CO",{maximumFractionDigits:0})} KB. Incluye archivos, papelera e historial.</p>
          <p className={styles.count}>
            El botón “Exportar respaldo” de la parte superior descarga todos los
            módulos. Puedes restaurar esa copia en este panel o en otro
            equipo. Los archivos adjuntos se incluyen en el respaldo.
          </p>
          <label className={styles.field}>
            Importar respaldo JSON
            <input
              type="file"
              accept=".json,application/json"
              disabled={importing}
              onChange={(e) => void restore(e.target.files?.[0])}
            />
          </label>
          <small>
            {cloud?"Al importar se reemplazan los registros actuales en tu espacio de Ksoft. Exporta antes un respaldo.":"Al importar se reemplaza la copia local completa. No se envía información a ningún servicio."}
          </small>
        </section>
        <section className={styles.panel}><h2>Recuperación y acceso</h2><p className={styles.count}>Puedes recuperar registros desde la papelera y consultar los últimos cambios guardados.</p><div className={styles.actions}><Link to="/dashboard/trash">Abrir papelera</Link><Link to="/dashboard/history">Ver historial</Link><Link to="/dashboard/access">{cloud?"Acceso privado":"Vista previa del acceso privado"}</Link></div><small>{cloud?"El acceso privado está conectado al espacio de Ksoft; solo las cuentas autorizadas pueden entrar.":"El acceso privado es una pantalla preparada para su conexión posterior; esta versión local todavía no utiliza cuentas."}</small></section>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
      </div>
    </>
  );
}
