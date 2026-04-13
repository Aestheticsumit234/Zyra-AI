import { motion } from "framer-motion";
import {
  HiOutlineBadgeCheck,
  HiOutlineChartSquareBar,
  HiOutlineLightningBolt,
  HiOutlineRefresh,
  HiOutlineSparkles,
  HiOutlineUserCircle,
} from "react-icons/hi";

const getScoreMeta = (score) => {
  if (score >= 8) {
    return {
      label: "Outstanding",
      color: "text-emerald-300",
      ring: "border-emerald-400/25",
      glow: "shadow-[0_0_60px_rgba(52,211,153,0.18)]",
      fill: "from-emerald-300 via-emerald-400 to-lime-300",
    };
  }

  if (score >= 6) {
    return {
      label: "Promising",
      color: "text-amber-300",
      ring: "border-amber-400/25",
      glow: "shadow-[0_0_60px_rgba(251,191,36,0.16)]",
      fill: "from-amber-200 via-amber-300 to-orange-300",
    };
  }

  return {
    label: "Developing",
    color: "text-rose-300",
    ring: "border-rose-400/25",
    glow: "shadow-[0_0_60px_rgba(251,113,133,0.16)]",
    fill: "from-rose-200 via-rose-300 to-red-300",
  };
};

const CircularScore = ({ score = 0 }) => {
  const safeScore = Number(score) || 0;
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(safeScore, 10)) / 10;
  const dashOffset = circumference - circumference * progress;
  const meta = getScoreMeta(safeScore);

  return (
    <div className="relative flex h-55 w-55 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.18),transparent_62%)] blur-2xl" />
      <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
        <defs>
          <linearGradient
            id="scoreGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#bef264" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute text-center">
        <div className={`text-6xl font-black tracking-tight ${meta.color}`}>
          {safeScore}
        </div>
        <div className="mt-1 text-xs uppercase tracking-[0.35em] text-neutral-500">
          Final Score
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, score, delay = 0 }) => {
  const safeScore = Number(score) || 0;
  const meta = getScoreMeta(safeScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className={`rounded-4xl border ${meta.ring} bg-white/4 p-6 backdrop-blur-2xl ${meta.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
            {title}
          </p>
          <h3 className="mt-3 text-4xl font-black text-white">
            {safeScore}/10
          </h3>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${meta.ring} ${meta.color}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${(Math.max(0, Math.min(safeScore, 10)) / 10) * 100}%`,
          }}
          transition={{ delay: delay + 0.15, duration: 0.55 }}
          className={`h-full rounded-full bg-linear-to-r ${meta.fill}`}
        />
      </div>
    </motion.div>
  );
};

const InsightRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
    <span className="text-sm text-neutral-400">{label}</span>
    <span className="text-sm font-medium text-neutral-200">{value}</span>
  </div>
);

const Step3Report = ({ reportData }) => {
  const {
    userName,
    name,
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    feedback = "You completed the interview. Keep sharpening your clarity and answer structure.",
  } = reportData || {};

  const candidateName = userName || name || "Candidate";
  const meta = getScoreMeta(Number(finalScore) || 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030303] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_20%),linear-gradient(180deg,#06120f_0%,#030303_42%,#020202_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-3xl"
        >
          <div className="grid gap-0 lg:grid-cols-12">
            <div className="lg:col-span-7 border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                  <HiOutlineSparkles className="text-2xl text-emerald-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.38em] text-emerald-300/70">
                    Interview Result
                  </p>
                  <h1 className="mt-1 text-3xl font-light md:text-5xl">
                    Performance Report
                  </h1>
                </div>
              </div>

              <div className="mt-10 max-w-2xl">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/3 px-4 py-3">
                  <HiOutlineUserCircle className="text-2xl text-emerald-300" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                      Candidate
                    </div>
                    <div className="text-sm font-medium text-neutral-200">
                      {candidateName}
                    </div>
                  </div>
                </div>

                <h2 className="mt-8 text-2xl font-light leading-tight text-white md:text-4xl">
                  A focused snapshot of how confidently and clearly the
                  interview was handled.
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-400 md:text-base">
                  This score reflects delivery, communication quality, and
                  factual correctness across the interview responses.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <InsightRow label="Status" value="Completed" />
                  <InsightRow label="Performance" value={meta.label} />
                  <InsightRow label="Scale" value="0 to 10" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 md:p-8">
              <div className="flex h-full flex-col items-center justify-center rounded-[2.25rem] border border-white/10 bg-black/20 p-6">
                <CircularScore score={finalScore} />
                <p
                  className={`mt-2 text-sm font-semibold uppercase tracking-[0.3em] ${meta.color}`}
                >
                  {meta.label}
                </p>
                <p className="mt-4 max-w-xs text-center text-sm leading-6 text-neutral-400">
                  A concise overall rating based on confidence, communication,
                  and correctness.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <MetricCard title="Confidence" score={confidence} delay={0.05} />
          <MetricCard
            title="Communication"
            score={communication}
            delay={0.12}
          />
          <MetricCard title="Correctness" score={correctness} delay={0.18} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.45 }}
            className="lg:col-span-8 rounded-[2.5rem] border border-white/10 bg-white/4 p-6 backdrop-blur-2xl md:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                <HiOutlineBadgeCheck className="text-2xl text-emerald-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                  Feedback
                </p>
                <h3 className="mt-1 text-2xl font-light">Evaluator Summary</h3>
              </div>
            </div>

            <div className="mt-6 rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6">
              <p className="text-lg leading-9 text-neutral-200 md:text-xl">
                {feedback}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="lg:col-span-4 rounded-[2.5rem] border border-white/10 bg-white/4p-6 backdrop-blur-2xl md:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                <HiOutlineChartSquareBar className="text-2xl text-emerald-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                  Reading
                </p>
                <h3 className="mt-1 text-2xl font-light">Interpretation</h3>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start gap-3">
                  <HiOutlineLightningBolt className="mt-0.5 text-xl text-emerald-300" />
                  <p className="text-sm leading-7 text-neutral-300">
                    Strong interview performance usually shows clear thinking,
                    stable delivery, and relevant answers.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start gap-3">
                  <HiOutlineRefresh className="mt-0.5 text-xl text-amber-300" />
                  <p className="text-sm leading-7 text-neutral-300">
                    Rehearsing concise examples and structured responses can
                    quickly improve future interview scores.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Step3Report;
