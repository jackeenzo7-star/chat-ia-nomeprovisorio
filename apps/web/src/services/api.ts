export const ping = async () => {
  const r = await fetch("/api/ping");
  return r.json();
};
