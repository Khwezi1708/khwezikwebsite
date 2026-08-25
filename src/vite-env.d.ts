/// <reference types="vite/client" />

interface MixcloudWidget {
  ready: Promise<void>
  seek: (seconds: number) => Promise<boolean>
  getPosition: () => Promise<number>
  events: {
    play: {
      on: (listener: () => void) => void
      off: (listener: () => void) => void
    }
  }
}

interface MixcloudApi {
  PlayerWidget: (iframe: HTMLIFrameElement) => MixcloudWidget
}

interface Window {
  Mixcloud?: MixcloudApi
}
