import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";

function AppRoutesContent() {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(!!session);
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  if (session === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={session ? <Navigate to="/" replace /> : <Auth />}
      />
      <Route
        path="/"
        element={session ? <Home /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/chat/:id"
        element={session ? <Chat /> : <Navigate to="/auth" replace />}
      />
    </Routes>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesContent />
    </BrowserRouter>
  );
}
