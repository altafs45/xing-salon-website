// Sliding-window rate limit kept in memory. Fine for one server process; behind several instances or on
// serverless, swap in a shared store (Redis, Upstash) with the same `hit` method.

export class RateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  /** Records a request for `key`; false when it is over the limit. */
  hit(key: string, now = Date.now()) {
    const recent = (this.hits.get(key) ?? []).filter((time) => now - time < this.windowMs);
    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    // Drop stale keys now and then so the map doesn't grow forever.
    if (this.hits.size > 5000) for (const [entry, times] of this.hits) if (times.every((time) => now - time >= this.windowMs)) this.hits.delete(entry);
    return true;
  }
}
