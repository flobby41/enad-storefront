// global.d.ts
import NodeCache from "node-cache"

/* eslint-disable no-var */
declare global {
  var storyblokCache: NodeCache | undefined
  interface Window {
    Inretrn: { init: (config: Record<string, unknown>) => void }
  }
}
/* eslint-enable no-var */

export {}
