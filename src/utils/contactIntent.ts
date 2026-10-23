type ContactProduct = { slug: string; name: string };

export function getContactIntent<T extends ContactProduct>(search: string, products: readonly T[]) {
  const params = new URLSearchParams(search);
  const product = products.find((item) => item.slug === params.get("producto"));
  return { product, isPilot: !!product && params.get("motivo") === "piloto" };
}

export function createContactMessage({ topic, productName, isPilot, message }: {
  topic: string; productName?: string; isPilot: boolean; message: string;
}) {
  return [
    `Motivo: ${isPilot ? "Solicitud de participación en el piloto" : topic}`,
    ...(productName ? [`Producto: ${productName}`] : []),
    "",
    message.trim() || (isPilot ? "Quiero conocer la disponibilidad y las condiciones para participar en el piloto." : ""),
  ].join("\n");
}
