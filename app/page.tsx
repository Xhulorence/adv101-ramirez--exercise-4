"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("paw-whiskers-session")) {
      router.replace("/notes");
    }
  }, [router]);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const [localPart] = trimmedEmail.split("@");
    const validGmail =
      /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/i.test(trimmedEmail) &&
      !localPart.startsWith(".") &&
      !localPart.endsWith(".") &&
      !localPart.includes("..");
    if (!validGmail) {
      setError("Please use a valid Gmail address ending in @gmail.com.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 7) {
      setError("Password must contain more than 6 characters.");
      return;
    }

    setError("");
    sessionStorage.setItem("paw-whiskers-session", trimmedEmail);
    router.push("/notes");
  }

  return (
    <main className="auth-page">
      <section className="welcome-panel" aria-labelledby="brand-title">
        <div className="welcome-inner">
          <Link className="brand pet-brand" href="/" aria-label="Paw and Whiskers home">
            <span className="paw-mark" aria-hidden="true"><i /><i /><i /><i /><b /></span>
            <span>Paw &amp; Whiskers</span>
          </Link>

          <div className="welcome-copy">
            <span className="welcome-kicker">A LITTLE LOVE GOES A LONG WAY</span>
            <h1 id="brand-title">Little paws,<br />big love.</h1>
            <p>Every little paw deserves love, care, and attention.</p>
          </div>

          <div className="pet-collage" aria-label="A golden retriever and a cat">
            <div className="dog-photo photo-frame">
              <Image src="/pet-dog.jpg" alt="A friendly golden retriever holding a flower" fill loading="eager" sizes="(max-width: 760px) 70vw, 42vw" />
              <span className="photo-caption">your best friend</span>
            </div>
            <div className="cat-photo photo-frame">
              <Image src="/pet-cat.jpg" alt="A curious black-and-white cat" fill sizes="(max-width: 760px) 33vw, 18vw" />
            </div>
            <span className="collage-paw paw-a" aria-hidden="true"><i /><i /><i /><i /><b /></span>
            <span className="collage-sparkle sparkle-a" aria-hidden="true">✳</span>
            <span className="collage-sparkle sparkle-b" aria-hidden="true">✳</span>
          </div>

          <p className="welcome-footer"><span className="footer-dot" /> A gentle home for every pet story</p>
        </div>
        <span className="welcome-shape shape-one" aria-hidden="true" />
        <span className="welcome-shape shape-two" aria-hidden="true" />
      </section>

      <section className="login-side" aria-label="Sign in">
        <div className="login-card">
          <div className="login-paw" aria-hidden="true"><span className="paw-mark"><i /><i /><i /><i /><b /></span></div>
          <div className="login-intro">
            <span className="eyebrow">YOUR PETS ARE WAITING</span>
            <h2>Welcome Back!</h2>
            <p>Sign in to continue caring for your furry friends.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin} noValidate>
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <span className="input-icon" aria-hidden="true">@</span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon lock-icon" aria-hidden="true">&#9679;</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="At least 7 characters"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
              />
              <button
                className="visibility-button"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button className="primary-button login-button" type="submit">Log in <span aria-hidden="true">&#8594;</span></button>
            {error && <p className="form-error" role="alert"><span aria-hidden="true">!</span>{error}</p>}
          </form>

          <p className="demo-note">Made with love for dogs and cats.</p>
        </div>
        <div className="login-side-note"><span className="mini-paw" aria-hidden="true">&#9829;</span> Little paws, big love.</div>
      </section>
    </main>
  );
}
