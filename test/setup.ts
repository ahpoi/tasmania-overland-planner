import "@testing-library/jest-dom/vitest"

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock

if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => {}
}

if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = () => {}
}

const originalGetComputedStyle = window.getComputedStyle.bind(window)

window.getComputedStyle = (element, pseudoElt) => {
  const styles = originalGetComputedStyle(element, pseudoElt)
  return new Proxy(styles, {
    get(target, prop, receiver) {
      if (prop === "transform" || prop === "webkitTransform" || prop === "mozTransform") {
        return Reflect.get(target, prop, receiver) || "none"
      }

      return Reflect.get(target, prop, receiver)
    },
  })
}
