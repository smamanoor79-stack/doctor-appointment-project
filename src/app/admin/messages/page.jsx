"use client";

import { useEffect, useState } from "react";

const token = {
  forest: "#16302A",
  cream: "#F7F4EE",
  card: "#FFFFFF",
  ink: "#0E1512",
  inkSoft: "#4B564F",
  line: "#E3DDD0",
  coral: "#DD6B3E",
  coralSoft: "#FBE1D2",
  sage: "#CDE0D2",
  sageDeep: "#2F6146",
};

function StatusPill({ status }) {
  const map = {
    unread: { color: token.coral, background: token.coralSoft, label: "Unread" },
    read: { color: token.inkSoft, background: token.line, label: "Read" },
    replied: { color: token.sageDeep, background: token.sage, label: "Replied" },
  };
  const s = map[status] || map.unread;
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ color: s.color, background: s.background }}
    >
      {s.label}
    </span>
  );
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [newMessageAlert, setNewMessageAlert] = useState(false);

  async function loadMessages(isPolling = false) {
    if (!isPolling) setLoading(true);
    try {
      const res = await fetch("/api/admin/contact");
      const data = await res.json();
      if (data.success) {
        if (isPolling && data.messages.length > messages.length) {
          setNewMessageAlert(true);
          setTimeout(() => setNewMessageAlert(false), 4000); // 4 sec baad khud hide
        }
        setMessages(data.messages);
      }
    } catch (err) {
      setError("Failed to load messages.");
    }
    if (!isPolling) setLoading(false);
  }

  useEffect(() => {
    loadMessages();

    const interval = setInterval(() => {
      loadMessages(true); 

    return () => clearInterval(interval);
  }, [messages.length]);

  const active = messages.find((m) => m._id === activeId);

  async function handleSendReply() {
    if (!replyText.trim() || !active) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/contact/${active._id}/reply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setMessages((prev) =>
        prev.map((m) => (m._id === active._id ? data.contact : m))
      );
      setReplyText("");
    } catch (err) {
      setError(err.message);
    }
    setSending(false);
  }

  return (
    <main className="px-6 py-8 max-w-6xl mx-auto" style={{ color: token.ink }}>
      <h1 className="font-semibold text-2xl mb-6" style={{ color: token.ink }}>
        Contact Messages
      </h1>

      {newMessageAlert && (
        <div
          className="rounded-xl px-4 py-3 mb-5 text-sm font-medium animate-pulse"
          style={{ background: token.sage, color: token.sageDeep }}
        >
          📩 New message received!
        </div>
      )}

      {error && (
        <div
          className="rounded-xl px-4 py-3 mb-5 text-sm"
          style={{ background: "#F8D7DA", color: "#842029" }}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Message list */}
        <div
          className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ background: token.card, borderColor: token.line }}
        >
          {loading ? (
            <p className="p-5 text-sm" style={{ color: token.inkSoft }}>
              Loading...
            </p>
          ) : messages.length === 0 ? (
            <p className="p-5 text-sm" style={{ color: token.inkSoft }}>
              No messages yet.
            </p>
          ) : (
            messages.map((m) => (
              <button
                key={m._id}
                onClick={() => {
                  setActiveId((prev) => (prev === m._id ? null : m._id));
                  setReplyText("");
                }}
                className="w-full text-left px-5 py-4 border-b last:border-b-0"
                style={{
                  borderColor: token.line,
                  background: activeId === m._id ? token.cream : "transparent",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{m.name}</p>
                  <StatusPill status={m.status} />
                </div>
                <p
                  className="text-xs truncate"
                  style={{ color: token.inkSoft }}
                >
                  {m.message}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Detail + reply */}
        <div
          className="lg:col-span-3 rounded-2xl border p-6"
          style={{ background: token.card, borderColor: token.line }}
        >
          {!active ? (
            <p className="text-sm" style={{ color: token.inkSoft }}>
              Select a message to view details.
            </p>
          ) : (
            <>
              <p className="font-semibold text-lg mb-1">{active.name}</p>
              <p className="text-xs mb-4" style={{ color: token.inkSoft }}>
                {active.email} · {active.phone}
              </p>
              <p className="text-sm mb-6">{active.message}</p>

              {active.reply?.text && (
                <div
                  className="rounded-xl p-4 mb-5 text-sm"
                  style={{ background: token.sage, color: token.sageDeep }}
                >
                  <p className="font-medium mb-1">Your reply:</p>
                  <p>{active.reply.text}</p>
                </div>
              )}

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Type your reply..."
                className="w-full rounded-xl border px-4 py-3 text-sm mb-4 outline-none"
                style={{ borderColor: token.line }}
              />
              <button
                onClick={handleSendReply}
                disabled={sending || !replyText.trim()}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: token.coral }}
              >
                {sending ? "Sending..." : "Send Reply"}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}