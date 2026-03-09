import { useState } from 'react';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  Reorder,
  useDragControls,
} from 'motion/react';

interface Guide {
  id: string;
  title: string;
  label: string;
}

const SPRING_TRANSITION = { type: 'spring', stiffness: 500, damping: 40 } as const;

const lbl = 'font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.13em] uppercase';

const GripIcon = () => (
  <svg width="9" height="11" viewBox="0 0 10 12" fill="currentColor">
    <circle cx="3" cy="2"  r="1.1" /><circle cx="7" cy="2"  r="1.1" />
    <circle cx="3" cy="6"  r="1.1" /><circle cx="7" cy="6"  r="1.1" />
    <circle cx="3" cy="10" r="1.1" /><circle cx="7" cy="10" r="1.1" />
  </svg>
);

const SearchIcon = () => (
  <svg width="11" height="11" viewBox="0 0 13 13" fill="none" className="text-[#666]">
    <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8.5 8.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <path d="M2 6h8M7 2.5l3.5 3.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SelectedItem = ({
  guide,
  index,
  onRemove,
}: {
  guide: Guide;
  index: number;
  onRemove: () => void;
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={guide.id}
      dragControls={controls}
      dragListener={false}
      layout
      transition={SPRING_TRANSITION}
      whileDrag={{ backgroundColor: 'rgba(255,255,255,0.03)', zIndex: 10 }}
      onClick={onRemove}
      className="group flex select-none items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-white/[0.02]"
    >
      <span className={`${lbl} text-[#555] w-[18px] shrink-0 text-right`}>
        {String(index + 1).padStart(2, '0')}
      </span>

      <span
        onPointerDown={(e) => controls.start(e)}
        onClick={(e) => e.stopPropagation()}
        className="touch-none shrink-0 text-[#444] cursor-grab active:cursor-grabbing transition-colors group-hover:text-zinc-500"
      >
        <GripIcon />
      </span>

      <span className="size-[5px] rounded-full bg-white shrink-0" />

      <span className="flex-1 text-[13px] font-medium text-white truncate">
        {guide.label}
      </span>

      <span className={`${lbl} text-[#555] shrink-0`}>{guide.id}</span>

      <span className={`${lbl} text-[#444] shrink-0 transition-colors group-hover:text-zinc-400`}>
        ✕
      </span>
    </Reorder.Item>
  );
};

const GuideComposer = ({ guides }: { guides: Guide[] }) => {
  const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const selectedGuides = selectedGuideIds
    .map((id) => guides.find((g) => g.id === id)!)
    .filter(Boolean);

  const unselectedGuides = guides
    .filter((g) => !selectedGuideIds.includes(g.id))
    .filter(
      (g) =>
        !normalizedQuery ||
        g.title.toLowerCase().includes(normalizedQuery) ||
        g.id.includes(normalizedQuery),
    );

  const usingAllGuides = selectedGuideIds.length === 0;
  const agentsRoutePath = usingAllGuides ? '/AGENTS.md' : `/${selectedGuideIds.join(',')}/AGENTS.md`;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const curlCommand = `curl -fsSL "${currentOrigin}${agentsRoutePath}" \\\n  -o AGENTS.md`;

  const toggleGuide = (id: string) =>
    setSelectedGuideIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const copyCurl = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand.replace(/\\\n\s+/g, ' '));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1200);
    } catch { /* ignore */ }
  };

  return (
    <div className="grid gap-px bg-white/10 lg:grid-cols-[1fr_280px] h-full">

      {/* ── Left: Guide Library ── */}
      <div className="flex flex-col min-h-0 overflow-hidden bg-black">

        {/* Section header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className={`${lbl} text-[#777]`}>Library</span>
            <span className={`${lbl} text-[#555]`}>{guides.length}</span>
          </div>
          <AnimatePresence>
            {selectedGuideIds.length > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`${lbl} text-white`}
              >
                {selectedGuideIds.length} selected
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
          <SearchIcon />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
              placeholder="search guides..."
              autoComplete="off"
              className="flex-1 min-w-0 bg-transparent font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.08em] uppercase text-white outline-none border-none placeholder:text-[#444]"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setQuery('')}
                  className={`${lbl} text-[#666] bg-transparent border-none cursor-pointer p-0`}
                >
                  ✕
                </motion.button>
              )}
            </AnimatePresence>
        </div>

        {/* Guide list */}
        <div className="flex-1 overflow-y-auto composer-scroll">
          <LayoutGroup>

            {/* Selected — reorderable */}
            <Reorder.Group
              as="div"
              axis="y"
              values={selectedGuideIds}
              onReorder={setSelectedGuideIds}
            >
              <AnimatePresence initial={false}>
                {selectedGuides.map((guide, i) => (
                  <SelectedItem
                    key={guide.id}
                    guide={guide}
                    index={i}
                    onRemove={() => toggleGuide(guide.id)}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>

            {/* Separator */}
            <AnimatePresence>
              {selectedGuides.length > 0 && unselectedGuides.length > 0 && (
                <motion.div
                  key="sep"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-px bg-white/10 my-1"
                />
              )}
            </AnimatePresence>

            {/* Unselected */}
            <AnimatePresence initial={false}>
              {unselectedGuides.map((guide, i) => (
                <motion.div
                  key={guide.id}
                  layout
                  transition={SPRING_TRANSITION}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <button
                    type="button"
                    onClick={() => toggleGuide(guide.id)}
                    className="group flex w-full items-center gap-3 px-4 py-2.5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-white/[0.025]"
                  >
                    <span className={`${lbl} text-[#444] w-[18px] shrink-0 text-right`}>
                      {String(selectedGuides.length + i + 1).padStart(2, '0')}
                    </span>

                    {/* Spacer for grip alignment */}
                    <span className="w-[9px] shrink-0" />

                    <span className="size-[5px] rounded-full border border-[#444] shrink-0 transition-colors group-hover:border-[#777]" />

                    <span className="flex-1 text-[13px] font-medium text-[#888] truncate transition-colors group-hover:text-white">
                      {guide.label}
                    </span>

                    <span className={`${lbl} text-[#555] shrink-0 transition-colors group-hover:text-[#666]`}>
                      {guide.id}
                    </span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty */}
            {normalizedQuery && unselectedGuides.length === 0 && selectedGuides.length === 0 && (
              <div className="px-4 py-12 text-center">
                <p className={`${lbl} text-[#555]`}>No guides match.</p>
              </div>
            )}

          </LayoutGroup>
        </div>

      </div>

      {/* ── Right: Output ── */}
      <aside className="flex flex-col min-h-0 overflow-hidden bg-black">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className={`${lbl} text-[#777]`}>Output</span>
            <span className={`${lbl} text-[#777] bg-white/[0.06] px-1.5 py-0.5 rounded-[3px]`}>
              {usingAllGuides ? 'ALL' : selectedGuideIds.length}
            </span>
          </div>
          <button
            onClick={() => setSelectedGuideIds([])}
            className={`${lbl} text-[#555] bg-transparent border-none cursor-pointer p-0 transition-colors hover:text-white`}
          >
            Clear
          </button>
        </div>

        <div className="flex-1 overflow-y-auto composer-scroll">

          {/* Route */}
          <div className="px-4 py-3 border-b border-white/10">
            <p className={`${lbl} text-[#555] mb-1.5`}>Route</p>
            <code className="block font-[family-name:var(--font-geist-mono)] text-[11px] text-[#888] bg-white/[0.03] border border-white/10 px-[10px] py-1.5 rounded overflow-x-auto whitespace-nowrap">
              {agentsRoutePath}
            </code>
          </div>

          {/* Curl */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className={`${lbl} text-[#555]`}>curl</p>
              <button
                onClick={copyCurl}
                className={`${lbl} ${isCopied ? 'text-white' : 'text-[#555]'} bg-transparent border-none cursor-pointer p-0 transition-colors hover:text-white`}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <code className="block font-[family-name:var(--font-geist-mono)] text-[11px] leading-[1.7] text-green-500 bg-black/60 border border-white/10 px-[10px] py-2 rounded overflow-x-auto whitespace-pre">
              {curlCommand}
            </code>
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0 px-4 py-3 border-t border-white/10">
          <a
            href={agentsRoutePath}
            className="flex items-center justify-center gap-2 py-2.5 bg-white text-black font-[family-name:var(--font-geist-mono)] text-[11px] font-semibold tracking-[0.1em] uppercase no-underline rounded-sm transition-colors hover:bg-zinc-200"
          >
            Open AGENTS.md
            <ArrowIcon />
          </a>
        </div>
      </aside>

      <style>{`
        .composer-scroll {
          scrollbar-width: thin;
          scrollbar-color: #1a1a1a transparent;
        }
        .composer-scroll::-webkit-scrollbar { width: 3px; }
        .composer-scroll::-webkit-scrollbar-track { background: transparent; }
        .composer-scroll::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 99px; }
      `}</style>
    </div>
  );
};

export default GuideComposer;
