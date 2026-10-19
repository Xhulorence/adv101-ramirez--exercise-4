"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default function NotesPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTimeout = window.setTimeout(() => {
      const savedEmail = sessionStorage.getItem("paw-whiskers-session");
      if (!savedEmail) {
        router.replace("/");
        return;
      }

      setEmail(savedEmail);
      try {
        const savedNotes = localStorage.getItem(`paw-whiskers-notes-${savedEmail.toLowerCase()}`);
        setNotes(savedNotes ? (JSON.parse(savedNotes) as Note[]) : []);
      } catch {
        setNotes([]);
      }
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(loadTimeout);
  }, [router]);

  useEffect(() => {
    if (isReady && email) {
      localStorage.setItem(`paw-whiskers-notes-${email.toLowerCase()}`, JSON.stringify(notes));
    }
  }, [email, isReady, notes]);

  function handleAddNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      setError("Please add both a title and details for this pet care note.");
      return;
    }

    setNotes((currentNotes) => [
      { id: Date.now(), title: cleanTitle, content: cleanContent, createdAt: new Date().toISOString() },
      ...currentNotes,
    ]);
    setTitle("");
    setContent("");
    setError("");
  }

  function handleLogout() {
    sessionStorage.removeItem("paw-whiskers-session");
    setTitle("");
    setContent("");
    setError("");
    router.replace("/");
  }

  if (!isReady) {
    return <main className="loading-page" aria-live="polite">Opening your notes...</main>;
  }

  return (
    <main className="notes-page">
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand pet-brand dashboard-brand" href="/notes" aria-label="Paw and Whiskers dashboard">
            <span className="paw-mark" aria-hidden="true"><i /><i /><i /><i /><b /></span>
            <span>Paw <em>&amp;</em> Whiskers</span>
          </Link>
          <div className="account-actions">
            <div className="account-copy"><span>Hello, Pet Lover!</span><span className="account-email">{email}</span></div>
            <button className="logout-button" type="button" onClick={handleLogout}>
              <span aria-hidden="true">&#8599;</span> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="notes-shell">
        <section className="pet-welcome-banner">
          <div className="banner-copy">
            <span className="eyebrow">A LITTLE CARE, EVERY DAY</span>
            <h1>Your Pet Care Journal</h1>
            <p>Keep track of your pets&apos; special moments, daily care, and important reminders in one place.</p>
            <span className="banner-signoff">For all the moments that make a home.</span>
          </div>
          <div className="banner-pets" aria-label="Our dog and cat friends">
            <div className="banner-dog"><Image src="/pet-dog.jpg" alt="Golden retriever" fill sizes="240px" /></div>
            <div className="banner-cat"><Image src="/pet-cat.jpg" alt="Black-and-white cat" fill sizes="180px" /></div>
            <span className="banner-heart" aria-hidden="true">&#9829;</span>
          </div>
        </section>

        <section className="notes-heading">
          <div>
            <span className="eyebrow">YOUR PETS, YOUR MEMORIES</span>
            <h2>My Pet Care Notes<span className="heading-period">.</span></h2>
            <p>Small details make a big difference in their care.</p>
          </div>
          <div className="note-count" aria-label={`${notes.length} saved notes`}>
            <span className="count-number">{notes.length.toString().padStart(2, "0")}</span>
            <span className="count-label">{notes.length === 1 ? "NOTE SAVED" : "NOTES SAVED"}</span>
          </div>
        </section>

        <section className="notes-workspace">
          <form className="note-composer" onSubmit={handleAddNote}>
            <div className="composer-heading">
              <span className="composer-icon" aria-hidden="true">+</span>
              <div>
                <h2>A note for your pet</h2>
                <p>Keep a little care detail close.</p>
              </div>
            </div>
            <label htmlFor="note-title">Note title</label>
            <input
              id="note-title"
              type="text"
              placeholder="Max's feeding schedule"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError("");
              }}
              maxLength={100}
            />
            <label htmlFor="note-content">Details</label>
            <textarea
              id="note-content"
              placeholder="Add a reminder, routine, or special moment..."
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setError("");
              }}
              rows={5}
            />
            <div className="composer-footer">
              <span className="save-hint"><span className="save-paw" aria-hidden="true">&#9829;</span> Saved in this browser</span>
              <button className="primary-button add-button" type="submit">Add Note <span aria-hidden="true">&#8594;</span></button>
            </div>
            {error && <p className="form-error note-error" role="alert"><span aria-hidden="true">!</span>{error}</p>}
          </form>

          <section className="note-list" aria-labelledby="saved-notes-heading">
            <div className="list-heading">
              <h2 id="saved-notes-heading">Saved care notes</h2>
              <span>{notes.length} {notes.length === 1 ? "item" : "items"}</span>
            </div>
            {notes.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon" aria-hidden="true"><span className="paw-mark"><i /><i /><i /><i /><b /></span></span>
                <h3>No notes just yet.</h3>
                <p>Your first little care reminder can go here.</p>
              </div>
            ) : (
              <div className="note-grid">
                {notes.map((note, index) => (
                  <article className={`note-card note-card-${index % 3}`} key={note.id}>
                    <div className="note-card-top">
                      <span className="note-paw" aria-hidden="true"><span className="paw-mark"><i /><i /><i /><i /><b /></span></span>
                      <time dateTime={note.createdAt}>{new Date(note.createdAt).toLocaleString()}</time>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => setNotes((currentNotes) => currentNotes.filter((item) => item.id !== note.id))}
                        aria-label={`Delete ${note.title}`}
                        title="Delete note"
                      >
                        <span aria-hidden="true">&#215;</span>
                      </button>
                    </div>
                    <h3>{note.title}</h3>
                    {note.content && <p>{note.content}</p>}
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
        <footer className="page-footer">Little paws, big love. <span aria-hidden="true">&#9829;</span></footer>
      </div>
    </main>
  );
}