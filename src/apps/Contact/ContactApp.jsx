import { useState } from "react";

import { getProfile, sendContact } from "../../services/api";
import useApi from "../../hooks/useApi";

const INITIAL = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const toUrl = (u = "") => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

const bare = (u = "") =>
  u.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

const CHANNEL_STYLES = {
  Email: {
    icon: "✉",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "hover:border-amber-200",
  },
  LinkedIn: {
    icon: "in",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "hover:border-amber-200",
  },
  GitHub: {
    icon: "⌘",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "hover:border-amber-200",
  },
};

const buildChannels = (me) =>
  [
    {
      label: "Email",
      value: me.email,
      href: `mailto:${me.email}`,
      description: "Send me a direct email",
    },
    {
      label: "LinkedIn",
      value: bare(me.linkedin),
      href: toUrl(me.linkedin),
      description: "Connect professionally",
    },
    {
      label: "GitHub",
      value: bare(me.github),
      href: toUrl(me.github),
      description: "Explore my projects",
    },
  ].filter((channel) => channel.value);

function ContactChannel({ channel, index }) {
  const style = CHANNEL_STYLES[channel.label];

  const isEmail = channel.href.startsWith("mailto:");

  return (
    <a
      href={channel.href}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noopener noreferrer"}
      className={`
        group flex min-w-0 items-center gap-3
        rounded-xl sm:rounded-2xl
        border border-[#ebe8e2] bg-white
        p-3 sm:p-4
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-md
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-amber-400
        ${style.border}
        animate-contact-card
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={`
          flex h-10 w-10 sm:h-11 sm:w-11 shrink-0
          items-center justify-center rounded-xl
          text-[15px] font-bold
          transition-transform duration-300
          group-hover:scale-105
          ${style.bg} ${style.text}
        `}
      >
        {style.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[12px] sm:text-[13px] font-semibold text-[#35271f] transition-colors group-hover:text-amber-600">
          {channel.label}
        </div>

        <div className="mt-0.5 text-[10px] sm:text-[11px] text-[#99938b]">
          {channel.description}
        </div>

        <div className="mt-1 truncate text-[10px] sm:text-[11px] text-[#77716a]">
          {channel.value}
        </div>
      </div>

      <span className="shrink-0 text-sm text-[#c4beb5] transition-all group-hover:translate-x-0.5 group-hover:text-amber-500">
        ↗
      </span>
    </a>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  rows,
  autoComplete,
}) {
  const shared = `
    block w-full min-w-0 max-w-full
    rounded-xl border border-[#e9e5de]
    bg-[#faf9f7]
    px-3 py-3 sm:px-3.5
    text-[13px] leading-relaxed text-[#35271f]
    outline-none
    placeholder:text-[#b4aea5]
    transition-all duration-200
    focus:border-amber-300
    focus:bg-white
    focus:ring-4 focus:ring-amber-500/[0.07]
  `;

  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#69635b]">
        {label}
        {required && <span className="text-amber-500">*</span>}
      </span>

      {rows ? (
        <textarea
          className={`${shared} min-h-[120px] resize-y sm:min-h-[140px]`}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          className={shared}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
        />
      )}
    </label>
  );
}

export default function ContactApp() {
  const { data: profile } = useApi(getProfile);

  const channels = profile ? buildChannels(profile) : [];

  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState(null);
  const [offline, setOffline] = useState(false);

  const update = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }));

    if (status === "error") {
      setStatus(null);
      setOffline(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setOffline(false);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setOffline(false);

    try {
      await sendContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setStatus("sent");
      setForm(INITIAL);
    } catch (error) {
      console.error("Contact request failed:", error);

      setStatus("error");

      if (error?.code === "ERR_BAD_RESPONSE" || !error?.response) {
        setOffline(true);
      }
    }
  };

  return (
    <div
      className="
        min-h-full w-full min-w-0
        overflow-x-clip
        bg-[#f8f7f4] text-[#35271f]
      "
    >
      <style>{`
        @keyframes contact-enter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes contact-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-contact-card {
          animation: contact-enter 400ms cubic-bezier(.2,.7,.2,1) both;
        }

        .animate-contact-float {
          animation: contact-float 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-contact-card,
          .animate-contact-float {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="
          mx-auto w-full max-w-5xl min-w-0
          px-3 py-4
          sm:px-5 sm:py-6
          md:px-7 md:py-8
          lg:px-8
        "
      >
        {/* Hero */}
        <section
          className="
            relative isolate mb-5
            overflow-hidden
            rounded-2xl sm:rounded-3xl
            border-2 border-[#35271f] bg-[#b9855f] text-[#35271f]
            p-4 sm:p-6 md:p-8 lg:p-9
            shadow-[6px_6px_0_#35271f]
            sm:mb-7
          "
        >
          <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl sm:h-72 sm:w-72" />

          <div className="pointer-events-none absolute -bottom-24 right-8 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl sm:right-36 sm:h-64 sm:w-64" />

          <div className="relative flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-400 text-xl text-[#35271f] animate-contact-float sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
              ✉
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 text-[9px] uppercase tracking-[0.18em] text-[#8f4f4d] sm:text-[10px]">
                Let's connect
              </div>

              <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl">
                Have a project in mind?
              </h1>

              <p className="mt-3 max-w-xl text-[11px] leading-relaxed text-[#754b4e] sm:text-[12px] md:text-[13px]">
                Whether it's a collaboration, an opportunity, or simply a
                conversation about technology, I'd love to hear from you.
              </p>
            </div>

            <div className="inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-2 text-[10px] text-amber-200 sm:self-center">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-700 animate-pulse" />
              Open to connect
            </div>
          </div>
        </section>

        {/* Main layout */}
        <div
          className="
            grid min-w-0 grid-cols-1
            items-start gap-4
            sm:gap-5
            lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]
          "
        >
          {/* Contact form */}
          <section
            className="
              min-w-0 rounded-2xl
              border border-[#ebe8e2] bg-white
              p-4 sm:p-5 md:p-7
              shadow-[0_8px_30px_rgba(30,25,15,0.025)]
            "
          >
            <div className="mb-5 flex min-w-0 items-start justify-between gap-3 sm:mb-6">
              <div className="min-w-0">
                <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-600 sm:text-[10px]">
                  Send a message
                </div>

                <h2 className="text-[17px] font-bold tracking-tight text-[#35271f] sm:text-[19px]">
                  Start a conversation
                </h2>

                <p className="mt-1.5 text-[11px] text-[#99938b]">
                  I'll get back to you as soon as I can.
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-600 sm:h-10 sm:w-10">
                ↗
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Your name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />

                <FormField
                  label="Email address"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>

              <FormField
                label="Subject"
                value={form.subject}
                onChange={update("subject")}
                placeholder="Let's collaborate"
              />

              <FormField
                label="Message"
                value={form.message}
                onChange={update("message")}
                placeholder="Tell me a little about what you have in mind..."
                rows={5}
                required
              />

              {status === "sent" && (
                <div
                  role="status"
                  className="flex min-w-0 items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[12px] text-amber-800 animate-contact-card"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    ✓
                  </span>

                  <div className="min-w-0">
                    <div className="font-semibold">
                      Message sent successfully!
                    </div>

                    <div className="mt-0.5 text-amber-800/80">
                      Thanks for reaching out. I'll be in touch.
                    </div>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div
                  role="alert"
                  className="flex min-w-0 items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[12px] text-amber-700"
                >
                  <span className="shrink-0">⚠</span>

                  <span className="min-w-0 break-words">
                    {offline
                      ? "Unable to reach the contact service. Please try again later or use a direct channel."
                      : "Please complete your name, email, and message."}
                  </span>
                </div>
              )}

              <div className="flex min-w-0 flex-col justify-between gap-3 pt-1 sm:flex-row sm:items-center">
                <p className="text-[10px] text-[#aaa49c]">* Required fields</p>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="
                    group inline-flex w-full min-w-0
                    items-center justify-center gap-2
                    rounded-xl border-2 border-[#35271f] bg-[#805239]
                    px-5 py-3
                    text-[12px] font-semibold text-[#ebd2c4]
                    transition-all duration-300
                    hover:-translate-y-0.5 hover:bg-amber-600
                    hover:shadow-lg hover:shadow-amber-900/10
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-amber-400
                    disabled:cursor-not-allowed disabled:opacity-50
                    disabled:hover:translate-y-0
                    sm:w-auto
                  "
                >
                  {status === "sending" ? (
                    <>
                      <span className="animate-spin">◌</span>
                      Sending message...
                    </>
                  ) : (
                    <>
                      Send message
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Direct channels */}
          <aside className="min-w-0 space-y-5">
            <section className="min-w-0">
              <div className="mb-4">
                <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-600 sm:text-[10px]">
                  Find me online
                </div>

                <h2 className="text-[16px] font-bold text-[#35271f] sm:text-[17px]">
                  Direct channels
                </h2>

                <p className="mt-1 text-[11px] text-[#99938b]">
                  Choose whichever works best for you.
                </p>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3">
                {channels.map((channel, index) => (
                  <ContactChannel
                    key={channel.label}
                    channel={channel}
                    index={index}
                  />
                ))}
              </div>
            </section>

            <section className="relative min-w-0 overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-4 sm:p-5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-200/30 blur-2xl" />

              <div className="relative">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-lg text-amber-600">
                  ✦
                </div>

                <h3 className="text-[13px] font-bold text-[#35271f] sm:text-[14px]">
                  Prefer a quick chat?
                </h3>

                <p className="mt-2 text-[11px] leading-relaxed text-[#858078]">
                  Feel free to reach out through LinkedIn or email. I'm always
                  interested in discussing software, backend engineering, and
                  meaningful project ideas.
                </p>

                <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-amber-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Always happy to connect
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <div
          className="
            mt-7 flex min-w-0 flex-col
            flex-wrap items-start justify-between
            gap-2 border-t border-[#eae7e1]
            pt-4 text-[10px] text-[#aaa49c]
            sm:mt-8 sm:flex-row sm:items-center
          "
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
            Communication interface ready
          </span>

          <span>Made with curiosity and code.</span>
        </div>
      </div>
    </div>
  );
}
