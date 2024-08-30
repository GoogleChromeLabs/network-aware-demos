/**
 * @jest-environment jsdom
 */

import { describe, expect, test, afterEach, jest } from "@jest/globals";
import { renderHook } from "@testing-library/react";

afterEach(function () {
  // Reload hook for every test
  jest.resetModules();
});

describe("useHardwareConcurrency", () => {
  const navigator = window.navigator;

  afterEach(() => {
    if (!window.navigator) window.navigator = navigator;
  });

  test(`should return "true" for unsupported case`, () => {
    Object.defineProperty(window, "navigator", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    const { useHardwareConcurrency } = require(".");
    const { result } = renderHook(() => useHardwareConcurrency());

    expect(result.current.unsupported).toBe(true);
  });

  test(`should return window.navigator.hardwareConcurrency`, () => {
    const { useHardwareConcurrency } = require(".");
    const { result } = renderHook(() => useHardwareConcurrency());

    expect(result.current.numberOfLogicalProcessors).toBe(
      window.navigator.hardwareConcurrency
    );
    expect(result.current.unsupported).toBe(false);
  });

  test("should return 4 for device of hardwareConcurrency = 4", () => {
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
      value: 4,
      configurable: true,
      writable: true,
    });
    const { useHardwareConcurrency } = require(".");
    const { result } = renderHook(() => useHardwareConcurrency());

    expect(result.current.numberOfLogicalProcessors).toEqual(4);
    expect(result.current.unsupported).toBe(false);
  });

  test("should return 2 for device of hardwareConcurrency = 2", () => {
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
      value: 2,
      configurable: true,
      writable: true,
    });
    const { useHardwareConcurrency } = require(".");
    const { result } = renderHook(() => useHardwareConcurrency());

    expect(result.current.numberOfLogicalProcessors).toEqual(2);
    expect(result.current.unsupported).toBe(false);
  });
});
