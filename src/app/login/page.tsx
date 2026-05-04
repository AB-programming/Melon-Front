'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';

interface Token {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
}

export default function Login() {
  const [loginResult, setLoginResult] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const codeVerifier = localStorage.getItem('code_verifier');
    if (code !== null && codeVerifier != null) {
      const urlencoded = new URLSearchParams();
      urlencoded.append('grant_type', 'authorization_code');
      urlencoded.append('scope', 'profile');
      urlencoded.append('client_id', 'melon');
      urlencoded.append('redirect_uri', 'http://localhost:3000/login');
      urlencoded.append('code', code);
      urlencoded.append('code_verifier', codeVerifier);
      fetch(`${process.env.NEXT_PUBLIC_AUTH_URI}/oauth2/token`, {
        method: 'POST',
        redirect: 'follow',
        body: urlencoded,
      })
        .then((response) => response.json())
        .then((token: Token) => {
          if (token.access_token !== undefined) {
            setLoginResult(true);
            localStorage.setItem('access_token', token.access_token);
            localStorage.setItem('login_status', 'true');
            confetti({
              particleCount: 200,
              spread: 70,
              origin: { y: 0.6 },
            });
            setTimeout(() => {
              window.location.href = '/';
            }, 2500);
          }
        })
        .catch((error) => console.error('error', error));
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center space-y-6">
        {loginResult ? (
          <svg
            className="mx-auto w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="mx-auto w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        <h1 className="text-3xl font-bold text-gray-800">
          {loginResult ? '登录成功' : '登录失败'}
        </h1>
        <p className="text-gray-600">
          {loginResult ? '登录成功，3s后回到首页' : '网络错误，请稍后再试'}
        </p>
      </div>
    </div>
  );
}
