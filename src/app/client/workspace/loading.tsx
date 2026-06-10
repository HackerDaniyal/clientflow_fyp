export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-brand-accent border-t-transparent rounded-full animate-spin" role="status" />
        <p className="text-text-secondary text-sm">Loading...</p>
      </div>
    </div>
  );
}
