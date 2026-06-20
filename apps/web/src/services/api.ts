import { toast } from "react-toastify";

const apiUrl = "/api";

export const ping = async () => {
  try {
    const res = await fetch(`${apiUrl}/ping`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log("API respondeu:", data);
    return data;
  } catch (error) {
    console.error("Erro ao pingar API:", error);
    toast.error("Erro ao conectar com a API");
  }
};
