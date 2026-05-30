"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconArrowsMove, IconChevronDown } from "@tabler/icons-react";
import { PIPELINE_STAGES, STAGE_META, type PipelineStage } from "./constants";

type MoveStageMenuProps = {
  currentStage: PipelineStage;
  disabled?: boolean;
  align?: "left" | "right";
  onMove: (stage: PipelineStage) => void;
};

export default function MoveStageMenu({
  currentStage,
  disabled = false,
  align = "left",
  onMove,
}: MoveStageMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const menuWidth = 192;
    const left =
      align === "right"
        ? Math.max(8, rect.right - menuWidth)
        : Math.min(rect.left, window.innerWidth - menuWidth - 8);
    setPosition({
      top: rect.bottom + 6,
      left,
    });
  };

  const openMenu = () => {
    if (disabled) return;
    updatePosition();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const onScroll = () => setOpen(false);

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  const targets = PIPELINE_STAGES.filter((s) => s !== currentStage);

  const menu =
    open && mounted ? (
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        style={{ position: "fixed", top: position.top, left: position.left, zIndex: 9999 }}
        className="w-48 max-h-60 overflow-y-auto rounded-large border border-[rgba(0,0,0,0.1)] bg-white py-1 shadow-xl"
      >
        {targets.map((stage) => {
          const meta = STAGE_META[stage];
          return (
            <button
              key={stage}
              type="button"
              role="menuitem"
              onClick={() => {
                onMove(stage);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-text-primary hover:bg-brand-surface"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
              {stage}
            </button>
          );
        })}
      </div>
    ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (open) setOpen(false);
          else openMenu();
        }}
        className="inline-flex items-center gap-1 rounded-medium border border-brand-light/80 bg-white px-2.5 py-1.5 text-[12px] font-medium text-brand-dark transition-colors hover:bg-brand-surface disabled:cursor-not-allowed disabled:opacity-50"
      >
        <IconArrowsMove size={14} stroke={2} />
        Move
        <IconChevronDown
          size={14}
          stroke={2}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {mounted && menu ? createPortal(menu, document.body) : null}
    </>
  );
}
