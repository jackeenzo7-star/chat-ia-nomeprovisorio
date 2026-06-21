import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const ping = async () => {
  try {
    const url = BASE_URL ? `${BASE_URL}/ping` : "/api/ping";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log("API respondeu:", data);
    return data;
  } catch (error) {
    console.error("Erro ao pingar API:", error);
    toast.error("Erro ao conectar com a API");
  }
};
