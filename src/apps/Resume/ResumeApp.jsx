import { useState } from "react";

import { getProfile, getResume } from "../../services/api";
import useApi from "../../hooks/useApi";
import ApiError from "../../components/ApiError/ApiError";

const ACCENTS = [
  {
    color: "teal",
    icon: "✳",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  {
    color: "orange",
    icon: "◈",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  {
    color: "emerald",
    icon: "✦",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-800",
    dot: "bg-amber-700",
  },
  {
    color: "blue",
    icon: "⌘",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  {
    color: "amber",
    icon: "✧",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  {
    color: "teal",
    icon: "◇",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
];

function SectionHeader({ title, count, subtitle, accent = "orange" }) {
  const colors = {
    orange: "bg-amber-100 text-amber-600",
    teal: "bg-amber-100 text-amber-600",
    emerald: "bg-amber-100 text-amber-800",
    blue: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="flex items-end justify-between gap-3 mb-4 mt-9 first:mt-0">
      <div>
        <div className="flex items-center gap-2.5">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${colors[accent]}`}
          >
            ✳
          </span>
          <h2 className="text-[16px] font-bold tracking-tight text-[#292724]">
            {title}
          </h2>
        </div>

        {subtitle && (
          <p className="text-[11px] text-[#99938b] mt-1 ml-9">{subtitle}</p>
        )}
      </div>

      {count !== undefined && (
        <span className="text-[11px] text-[#8f8981] bg-white border border-[#ebe8e2] rounded-full px-3 py-1">
          {String(count).padStart(2, "0")} entries
        </span>
      )}
    </div>
  );
}

function ExperienceCard({ experience, index, active, onClick }) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <article
      className={`
        group relative overflow-hidden rounded-2xl border
        transition-all duration-300 ease-out
        animate-resume-card
        ${
          active
            ? "border-amber-200 bg-white shadow-[0_12px_35px_rgba(180,110,40,0.08)] -translate-y-0.5"
            : "border-[#ebe8e2] bg-white hover:border-amber-200 hover:shadow-[0_10px_30px_rgba(30,25,15,0.05)] hover:-translate-y-1"
        }
      `}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-expanded={active}
        className="w-full text-left p-4 sm:p-5"
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`
              shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
              text-lg transition-transform duration-300
              ${accent.bg} ${accent.text}
              group-hover:scale-105
            `}
          >
            {accent.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[14px] sm:text-[15px] font-bold text-[#35271f] group-hover:text-amber-600 transition-colors">
                {experience.title}
              </h3>

              {experience.type && (
                <span
                  className={`text-[10px] font-medium px-2 py-1 rounded-full ${accent.bg} ${accent.text}`}
                >
                  {experience.type}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
              <span className="text-[12px] font-medium text-[#77716a]">
                {experience.company}
              </span>
              <span className="text-[#d5d0c8]">·</span>
              <span className="text-[11px] text-[#99938b]">
                {experience.period}
              </span>
            </div>
          </div>

          <span
            className={`
              shrink-0 w-7 h-7 rounded-full flex items-center justify-center
              text-sm transition-all duration-300
              ${
                active
                  ? "bg-amber-100 text-amber-600 rotate-90"
                  : "bg-[#f0e8dc] text-[#99938b] group-hover:bg-amber-50 group-hover:text-amber-600"
              }
            `}
          >
            →
          </span>
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-4 sm:mx-5 border-t border-[#f0ede8]">
            <div className="py-4 space-y-3">
              {experience.points?.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-[12px] leading-relaxed text-[#77716a]"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span
                    className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${accent.bg} ${accent.text}`}
                  >
                    ✓
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pb-4 text-[10px] text-[#aaa49c]">
              <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
              Experience details
              <span className="ml-auto">
                #{String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function EducationCard({ education, index }) {
  const accent = ACCENTS[(index + 1) % ACCENTS.length];

  return (
    <article
      className="group relative overflow-hidden border border-[#ebe8e2] bg-white rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_10px_30px_rgba(30,25,15,0.05)] animate-resume-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-lg ${accent.bg} ${accent.text} transition-transform duration-300 group-hover:scale-105`}
        >
          ◫
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-bold text-[#35271f] group-hover:text-amber-600 transition-colors">
            {education.degree}
          </h3>

          <div className="text-[12px] text-[#77716a] mt-1.5">
            {education.institution}
          </div>

          <div className="inline-flex items-center gap-1.5 mt-2 text-[10px] text-[#99938b] bg-[#f8f7f4] rounded-full px-2.5 py-1">
            <span>◷</span>
            {education.period}
          </div>

          {education.notes && (
            <div className="mt-3 pt-3 border-t border-[#f0ede8] text-[12px] leading-relaxed text-[#858078]">
              {education.notes}
            </div>
          )}
        </div>
      </div>

      <span className="absolute right-4 top-4 text-[10px] text-[#c8c2b9]">
        {String(index + 1).padStart(2, "0")}
      </span>
    </article>
  );
}

function CertificationCard({ certification, index }) {
  const accent = ACCENTS[(index + 2) % ACCENTS.length];

  return (
    <article
      className="group flex items-center gap-3.5 border border-[#ebe8e2] bg-white rounded-xl p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_8px_22px_rgba(30,25,15,0.04)] animate-resume-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-base ${accent.bg} ${accent.text} transition-transform duration-300 group-hover:rotate-6`}
      >
        ◆
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-semibold text-[#35271f] group-hover:text-amber-800 transition-colors">
          {certification.name}
        </div>
        <div className="text-[11px] text-[#99938b] mt-1">
          {certification.issuer}
        </div>
      </div>

      {certification.year && (
        <span className="shrink-0 text-[10px] text-[#8f8981] bg-[#f8f7f4] rounded-full px-2.5 py-1">
          {certification.year}
        </span>
      )}
    </article>
  );
}

function ProfileField({ label, value, accent = "orange" }) {
  const colors = {
    orange: "text-amber-600",
    teal: "text-amber-600",
    emerald: "text-amber-800",
    blue: "text-amber-600",
  };

  return (
    <div className="rounded-xl border border-[#ebe8e2] bg-white p-4 transition-all duration-200 hover:border-amber-200 hover:-translate-y-0.5">
      <div className="text-[10px] uppercase tracking-[0.14em] text-[#aaa49c] mb-2">
        {label}
      </div>
      <div className={`text-[13px] font-semibold ${colors[accent]}`}>
        {value || "—"}
      </div>
    </div>
  );
}

export default function ResumeApp() {
  const resumeQ = useApi(getResume);
  const profileQ = useApi(getProfile);

  const [activeExperience, setActiveExperience] = useState(null);
  const [activeTab, setActiveTab] = useState("resume");

  const r = resumeQ.data;
  const profile = profileQ.data;

  const loading = resumeQ.loading || profileQ.loading;
  const error = resumeQ.error || profileQ.error;
  const offline = Boolean(error);

  const reload = () => {
    resumeQ.reload();
    profileQ.reload();
  };

  return (
    <div className="h-full flex flex-col bg-[#f8f7f4] text-[#35271f]">
      <style>{`
        @keyframes resume-card-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes resume-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-resume-card {
          animation: resume-card-enter 450ms cubic-bezier(.2,.7,.2,1) both;
        }

        .animate-resume-fade {
          animation: resume-fade-in 350ms ease both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-resume-card,
          .animate-resume-fade {
            animation: none;
          }

          .animate-resume-card {
            transition: none;
          }
        }
      `}</style>

      {/* Application tabs */}
      <div className="shrink-0 border-b border-[#eae7e1] bg-white/90 backdrop-blur-sm px-4 sm:px-6">
        <div className="flex items-center gap-2 min-h-[54px]">
          <button
            type="button"
            onClick={() => setActiveTab("resume")}
            className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-200 ${
              activeTab === "resume"
                ? "bg-[#b9855f] text-[#35271f] shadow-sm"
                : "text-[#827c74] hover:bg-[#f5f3ef] hover:text-[#35271f]"
            }`}
          >
            <span>▤</span>
            Resume
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-[#b9855f] text-[#35271f] shadow-sm"
                : "text-[#827c74] hover:bg-[#f5f3ef] hover:text-[#35271f]"
            }`}
          >
            <span>◇</span>
            Profile
          </button>

          <div className="ml-auto flex items-center gap-2 text-[10px]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                offline ? "bg-amber-500" : "bg-amber-700"
              }`}
            />
            <span className="hidden sm:inline text-[#99938b]">
              {offline ? "Connection issue" : "Live profile"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="h-full min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mx-auto mb-4 animate-pulse">
                ✳
              </div>
              <div className="text-[13px] font-semibold text-[#49443e]">
                Preparing your resume
              </div>
              <div className="text-[11px] text-[#aaa49c] mt-1">
                Fetching your latest profile details...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-5">
            <ApiError
              endpoint={resumeQ.error ? "/api/resume" : "/api/profile"}
              onRetry={reload}
            />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 py-6 sm:px-7 sm:py-8 animate-resume-fade">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl border-2 border-[#35271f] bg-[#d9b782] text-[#35271f] p-5 sm:p-8 mb-8 shadow-[6px_6px_0_#35271f]">
              <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
              <div className="absolute right-20 bottom-[-100px] w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#9a6b25] mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#77734f]" />
                  Professional profile
                  <span className="text-[#b9924e]">/</span>
                  Resume
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="w-16 h-16 shrink-0 rounded-2xl border-2 border-[#35271f] bg-[#8b5e3c] text-[#35271f] flex items-center justify-center text-2xl font-bold shadow-[3px_3px_0_#35271f]">
                    {profile.name?.charAt(0) || "N"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {profile.name}
                    </h1>

                    <p className="text-[13px] sm:text-[14px] text-[#9a6b25] mt-2">
                      {profile.speciality}
                    </p>

                    <p className="max-w-2xl text-[12px] sm:text-[13px] leading-relaxed text-[#765c37] mt-4">
                      {profile.bio}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-7 pt-5 border-t-2 border-dashed border-[#b17a45]">
                  <div className="rounded-xl bg-[#f4ede3]/70 border-2 border-[#b17a45] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-[#9a6b25] mb-1.5">
                      Location
                    </div>
                    <div className="text-[12px] font-medium text-[#5c4630]">
                      {profile.stats.location}
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#f4ede3]/70 border-2 border-[#b17a45] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-[#9a6b25] mb-1.5">
                      Education
                    </div>
                    <div className="text-[12px] font-medium text-[#5c4630]">
                      {profile.stats.education}
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#f4ede3]/70 border-2 border-[#b17a45] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-[#9a6b25] mb-1.5">
                      Focus
                    </div>
                    <div className="text-[12px] font-medium text-[#5c4630]">
                      {profile.stats.focus}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 text-[11px] text-[#77734f]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#77734f] animate-pulse" />
                  {profile.openTo}
                </div>
              </div>
            </section>

            {/* Profile tab */}
            {activeTab === "profile" && (
              <section className="animate-resume-fade">
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-amber-600 font-semibold mb-2">
                    Profile data
                  </div>
                  <h2 className="text-xl font-bold text-[#35271f]">
                    A quick overview
                  </h2>
                  <p className="text-[12px] text-[#8f8981] mt-1">
                    Key information from your public profile.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ProfileField
                    label="Name"
                    value={profile.name}
                    accent="teal"
                  />
                  <ProfileField
                    label="Role"
                    value={profile.speciality}
                    accent="orange"
                  />
                  <ProfileField
                    label="Location"
                    value={profile.stats.location}
                    accent="emerald"
                  />
                  <ProfileField
                    label="Education"
                    value={profile.stats.education}
                    accent="blue"
                  />
                  <ProfileField
                    label="Focus"
                    value={profile.stats.focus}
                    accent="teal"
                  />
                  <ProfileField
                    label="Availability"
                    value={profile.openTo}
                    accent="emerald"
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-[#ebe8e2] bg-white p-5">
                  <div className="text-[12px] font-semibold text-[#35271f] mb-2">
                    About
                  </div>
                  <p className="text-[12px] leading-6 text-[#77716a]">
                    {profile.bio}
                  </p>
                </div>
              </section>
            )}

            {/* Resume tab */}
            {activeTab === "resume" && (
              <div className="animate-resume-fade">
                <SectionHeader
                  title="Experience"
                  count={r.experience?.length}
                  subtitle="Roles, responsibilities, and practical work."
                  accent="orange"
                />

                <div className="space-y-3">
                  {r.experience?.map((experience, index) => (
                    <ExperienceCard
                      key={experience.id || index}
                      experience={experience}
                      index={index}
                      active={activeExperience === index}
                      onClick={() =>
                        setActiveExperience(
                          activeExperience === index ? null : index,
                        )
                      }
                    />
                  ))}
                </div>

                <SectionHeader
                  title="Education"
                  count={r.education?.length}
                  subtitle="Academic background and qualifications."
                  accent="teal"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {r.education?.map((education, index) => (
                    <EducationCard
                      key={education.id || index}
                      education={education}
                      index={index}
                    />
                  ))}
                </div>

                <SectionHeader
                  title="Certifications"
                  count={r.certifications?.length}
                  subtitle="Courses and credentials."
                  accent="emerald"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {r.certifications?.map((certification, index) => (
                    <CertificationCard
                      key={certification.id || index}
                      certification={certification}
                      index={index}
                    />
                  ))}
                </div>

                {/* Download */}
                <section className="relative overflow-hidden mt-9 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-5 sm:p-6">
                  <div className="absolute -right-10 -top-12 w-36 h-36 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />

                  <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-[15px] font-bold text-[#35271f]">
                        Want the complete resume?
                      </div>
                      <p className="text-[12px] text-[#8f8981] mt-1">
                        Get the latest PDF version for your reference.
                      </p>
                    </div>

                    <a
                      href="/resume.pdf"
                      download
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-[#35271f] bg-[#805239] text-[#35271f] text-[12px] font-semibold transition-all duration-300 hover:bg-[#b9855f] hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <span>↓</span>
                      Download PDF
                    </a>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom status */}
      <div className="shrink-0 border-t border-[#eae7e1] bg-white px-4 sm:px-6 py-2 flex items-center gap-3 text-[10px] text-[#aaa49c]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
          {offline ? "Connection issue" : "Profile loaded"}
        </span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">
          {r ? `${r.experience?.length || 0} experience entries` : ""}
        </span>
        <span className="ml-auto">
          {activeTab === "resume" ? "Resume" : "Profile"}
        </span>
      </div>
    </div>
  );
}
