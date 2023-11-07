import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Authentication from './AuthProvider'
import { BrowserRouter, Router } from 'react-router-dom'
import AuthProvider from './AuthProvider'
import supabase from './config/supabaseClient.js'

export var isLoggedIn:Boolean = (await supabase.auth.getSession()).data.session != null;

export function SetLoginStatus(b:Boolean)
{
  isLoggedIn = b;
}

console.log("Status " + isLoggedIn);
//console.log((await supabase.auth.getSession()).data.session);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
