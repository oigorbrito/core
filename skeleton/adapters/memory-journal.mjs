export function memoryJournal() {
  const events = [];
  return {
    async append(event) { events.push(structuredClone(event)); },
    snapshot() { return structuredClone(events); }
  };
}
