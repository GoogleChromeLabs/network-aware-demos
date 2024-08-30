/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'

afterEach(function() {
  // Reload hook for every test
  jest.resetModules();
});

describe('useSaveData', () => {
  test(`should return "true" for unsupported case`, () => {
    const { useSaveData } = require('./save-data');
    const { result } = renderHook(() => useSaveData());

    expect(result.current.unsupported).toBe(true);
    expect(result.current.saveData).toEqual(null);
  });

  test('should return initialSaveData for unsupported case', () => {
    const initialSaveData = true;
    const { useSaveData } = require('./save-data');
    const { result } = renderHook(() => useSaveData(initialSaveData));

    expect(result.current.unsupported).toBe(true);
    expect(result.current.saveData).toBe(initialSaveData);
  });

  test(`should return "true" for enabled save data`, () => {
    global.navigator.connection = {
      saveData: true
    };
    const { useSaveData } = require('./save-data');
    const { result } = renderHook(() => useSaveData());

    expect(result.current.unsupported).toBe(false);
    expect(result.current.saveData).toEqual(navigator.connection.saveData);
  });

  test(`should return "false" for disabled save data`, () => {
    global.navigator.connection = {
      saveData: false
    };
    const { useSaveData } = require('./save-data');
    const { result } = renderHook(() => useSaveData());

    expect(result.current.unsupported).toBe(false);
    expect(result.current.saveData).toEqual(navigator.connection.saveData);
  });

  test('should not return initialSaveData for supported case', () => {
    const initialSaveData = false;
    global.navigator.connection = {
      saveData: true
    };
    const { useSaveData } = require('./save-data');
    const { result } = renderHook(() => useSaveData(initialSaveData));

    expect(result.current.unsupported).toBe(false);
    expect(result.current.saveData).toEqual(navigator.connection.saveData);
  });
});
