let { JSDOM } = require('jsdom')

const { window } = new JSDOM(`<!DOCTYPE html>`, {
  url: "http://localhost/",
  storageQuota: 10000000,
  pretendToBeVisual: true,
  FetchExternalResources: false,
  ProcessExternalResources: false
});

for (let prop in window) {
  if (prop in global) continue
  Object.defineProperty(global, prop, {
    configurable: true,
    get: () => window[prop]
  })
}

