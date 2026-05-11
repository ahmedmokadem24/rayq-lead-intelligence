"use client";

export function ConfirmModal({
  title = "Delete lead",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  busy = false
}: {
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="surface-card w-full max-w-md p-5 shadow-premium">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-champagne">{title}</p>
        <p className="mt-3 text-sm leading-6 text-linen/78">{message}</p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy}>Cancel</button>
          <button type="button" className="btn bg-red-500/85 text-white hover:bg-red-500 disabled:opacity-60" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
