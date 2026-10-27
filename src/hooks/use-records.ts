import { useCallback, useEffect, useState } from "react";
import sample from "@/data/sample-records.json";
import { createRecord, loadRecords, parseRecords, saveRecords, type RecordInput, type WasteRecord } from "@/lib/waste";

export const DEMO_RECORDS: WasteRecord[] = parseRecords(JSON.stringify(sample)).map((r) => ({ ...r, isDemo: true }));

/** All record reads/writes go through localStorage so every page sees the same data. */
export function useRecords() {
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());
    setReady(true);
    const onStorage = () => setRecords(loadRecords());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((next: WasteRecord[]) => {
    const ok = saveRecords(next);
    if (ok) setRecords(next);
    return ok;
  }, []);

  const add = useCallback((input: RecordInput) => {
    const rec = createRecord(input);
    return commit([rec, ...loadRecords()]) ? rec : null;
  }, [commit]);

  const remove = useCallback((id: string) => commit(loadRecords().filter((r) => r.id !== id)), [commit]);

  const setPlan = useCallback(
    (id: string, reuseId: string | null) =>
      commit(loadRecords().map((r) => (r.id === id ? { ...r, plannedReuseId: reuseId } : r))),
    [commit],
  );

  const loadDemo = useCallback(() => {
    const current = loadRecords().filter((r) => !r.isDemo);
    return commit([...current, ...DEMO_RECORDS]);
  }, [commit]);

  const clearDemo = useCallback(() => commit(loadRecords().filter((r) => !r.isDemo)), [commit]);
  const clearAll = useCallback(() => commit([]), [commit]);

  return { records, ready, add, remove, setPlan, loadDemo, clearDemo, clearAll };
}
