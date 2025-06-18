export async function register() {
  const NodeCache = (await import("node-cache")).default
  const config = { stdTTL: 100 }

  globalThis.storyblokCache = new NodeCache(config)
}
