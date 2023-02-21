/* eslint-disable  @typescript-eslint/no-explicit-any */

export function doOnceDecorator<T extends TFn>(fn: T | null, context?: any): T {
  let result: ReturnType<T>;

  return function (this: any, ...args): ReturnType<T> {
    if (fn) {
      result = fn.apply(context || this, args);
      // eslint-disable-next-line no-param-reassign
      fn = context = null;
    }

    return result;
  } as T;
}

type TFn = (...args: any) => any;
