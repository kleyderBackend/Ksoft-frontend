import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../AdminContext";
import { financialSummary, money, modules, moduleKeys } from "../../businessModel";
import styles from "./ReportsManager.module.css";

export function ReportsManager() {
  const { data } = useAdmin();
  const [from, setFrom] = useState(""),
    [to, setTo] = useState("");
  const summary = financialSummary(data.workspace, from, to);
  const invalid = from && to && from > to;
  const stats = [
    { label: "Ingresos recibidos", value: summary.income },
    { label: "Gastos pagados", value: summary.expenses },
    { label: "Balance del período", value: summary.net },
    { label: "Por cobrar", value: summary.receivable },
    { label: "Por pagar", value: summary.payable },
  ];
  const grouped = new Map<string, { income: number; expenses: number }>();
  for (const key of ["payments", "expenses"] as const)
    for (const record of data.workspace.records[key]) {
      if (
        record.values.status !== "Pagado" ||
        !record.values.date ||
        (from && record.values.date < from) ||
        (to && record.values.date > to)
      )
        continue;
      const month = record.values.date.slice(0, 7),
        previous = grouped.get(month) || { income: 0, expenses: 0 };
      previous[key === "payments" ? "income" : "expenses"] +=
        Math.round(Number(record.values.amount) * 100) / 100;
      grouped.set(month, previous);
    }
  const months = [...grouped].sort(([a], [b]) => a.localeCompare(b));
  const max = Math.max(
    1,
    ...months.flatMap(([, value]) => [value.income, value.expenses]),
  );
  return (
    <>
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <label className={styles.field}>
            Desde
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            Hasta
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <button
            onClick={() => {
              setFrom("");
              setTo("");
            }}
          >
            Todo el período
          </button>
        </div>
        {invalid ? (
          <p role="alert" className={styles.error}>
            La fecha inicial debe ser anterior o igual a la final.
          </p>
        ) : (
          <>
            <section
              className={styles.grid}
              aria-label="Indicadores financieros"
            >
              {stats.map((stat) => (
                <article className={styles.card} key={stat.label}>
                  <p className={styles.cardLabel}>{stat.label}</p>
                  <p className={styles.moneyValue}>{money(stat.value)}</p>
                </article>
              ))}
            </section>
            <p className={styles.count}>
              Ingresos y gastos solo incluyen movimientos marcados como pagados.
              El balance es ingresos menos gastos registrados; no representa un
              resultado contable completo. Importes en COP.
            </p>
            <section className={styles.panel}>
              <h2>Ingresos y gastos por mes</h2>
              {months.length ? (
                months.map(([month, value]) => (
                  <div className={styles.chartRow} key={month}>
                    <strong>{month}</strong>
                    <div>
                      <span>Ingresos · {money(value.income)}</span>
                      <meter
                        aria-label={"Ingresos de " + month}
                        value={value.income}
                        min="0"
                        max={max}
                      />
                      <span>Gastos · {money(value.expenses)}</span>
                      <meter
                        className={styles.expenseMeter}
                        aria-label={"Gastos de " + month}
                        value={value.expenses}
                        min="0"
                        max={max}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.count}>
                  Registra un pago recibido o un gasto pagado para ver la
                  evolución.
                </p>
              )}
            </section>
          </>
        )}
        <section className={styles.panel}>
          <h2>Actividad de la empresa</h2>
          <div className={styles.quickGrid}>
            {moduleKeys
              .filter((key) => key !== "files")
              .map((key) => (
                <Link key={key} to={"/dashboard/" + key}>
                  <span>{modules[key].title.toUpperCase()}</span>
                  <h3>{data.workspace.records[key].length} registros</h3>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
