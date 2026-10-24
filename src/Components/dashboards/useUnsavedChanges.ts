import { useEffect } from "react";

export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    const beforeModuleChange = (event: Event) => {
      if (!window.confirm("Tienes cambios sin guardar. ¿Quieres cambiar de apartado y descartarlos?")) event.preventDefault();
    };
    const beforeNavigation = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (anchor?.closest("[data-local-preview]")) return;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download") || anchor.href === window.location.href || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (!window.confirm("Tienes cambios sin guardar. ¿Quieres salir y descartarlos?")) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("ksoft:before-module-change", beforeModuleChange);
    document.addEventListener("click", beforeNavigation, true);
    return () => { window.removeEventListener("beforeunload", beforeUnload); window.removeEventListener("ksoft:before-module-change", beforeModuleChange); document.removeEventListener("click", beforeNavigation, true); };
  }, [dirty]);
}
