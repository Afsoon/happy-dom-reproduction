import { installGlobals } from "@remix-run/node";

installGlobals();

const Signal = new AbortSignal();

const SignalProxied = new Proxy(Signal, {
  get: (target, prop, receiver) => {
    if (prop === Symbol.toStringTag) {
      return "AbortSignal";
    }

    return Reflect.get(target, prop, receiver);
  },
});

const controller = new AbortController();
const ControllerProxied = new Proxy(controller, {
  get: (target, prop, receiver) => {
    if (prop === "signal") {
      return SignalProxied;
    }

    return Reflect.get(target, prop, receiver);
  },
});

global.AbortController = new Proxy(global.AbortController, {
  construct: () => {
    return ControllerProxied;
  },
});
