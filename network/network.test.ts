/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { describe, expect, test, jest, afterEach } from "@jest/globals";
import { useNetworkStatus } from ".";

describe("useNetworkStatus", () => {
  const map: {
    [key: string]: Function;
  } = {};

  const ectStatusListeners = {
    addEventListener: jest.fn().mockImplementation((event, callback) => {
      // @ts-ignore
      map[event] = callback;
    }),
    removeEventListener: jest.fn(),
  };

  afterEach(() => {
    Object.values(ectStatusListeners).forEach((listener) =>
      listener.mockClear()
    );
  });

  /**
   * Tests that addEventListener or removeEventListener was called during the
   * lifecycle of the useEffect hook within useNetworkStatus
   */
  const testEctStatusEventListenerMethod = (method: any) => {
    expect(method).toBeCalledTimes(1);
    expect(method.mock.calls[0][0]).toEqual("change");
    expect(method.mock.calls[0][1].constructor).toEqual(Function);
  };

  test(`should return "true" for unsupported case`, () => {
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.unsupported).toBe(true);
  });

  test("should return initialEffectiveConnectionType for unsupported case", () => {
    const initialEffectiveConnectionType = "4g";

    const { result } = renderHook(() =>
      useNetworkStatus(initialEffectiveConnectionType)
    );

    expect(result.current.unsupported).toBe(true);
    expect(result.current.effectiveConnectionType).toBe(
      initialEffectiveConnectionType
    );
  });

  test("should return 4g of effectiveConnectionType", () => {
    // @ts-ignore
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: "4g",
    };

    const { result } = renderHook(() => useNetworkStatus());

    testEctStatusEventListenerMethod(ectStatusListeners.addEventListener);
    expect(result.current.unsupported).toBe(false);
    expect(result.current.effectiveConnectionType).toEqual("4g");
  });

  test("should not return initialEffectiveConnectionType for supported case", () => {
    const initialEffectiveConnectionType = "2g";
    // @ts-ignore
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: "4g",
    };

    const { result } = renderHook(() =>
      useNetworkStatus(initialEffectiveConnectionType)
    );

    testEctStatusEventListenerMethod(ectStatusListeners.addEventListener);
    expect(result.current.unsupported).toBe(false);
    expect(result.current.effectiveConnectionType).toEqual("4g");
  });

  test("should update the effectiveConnectionType state", () => {
    const { result } = renderHook(() => useNetworkStatus());

    act(() =>
      result.current.setNetworkStatus({ effectiveConnectionType: "2g" })
    );

    expect(result.current.effectiveConnectionType).toEqual("2g");
  });

  test("should update the effectiveConnectionType state when navigator.connection change event", () => {
    // @ts-ignore
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: "2g",
    };

    const { result } = renderHook(() => useNetworkStatus());
    // @ts-ignore
    global.navigator.connection.effectiveType = "4g";
    act(() => map.change());

    expect(result.current.effectiveConnectionType).toEqual("4g");
  });
});
