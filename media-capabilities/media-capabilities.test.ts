/**
 * @jest-environment jsdom
 */

import "babel-polyfill";
import { describe, expect, test, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react";

const mediaDecodingConfig = {
  type: "file",
  audio: {
    contentType: "audio/mp3",
    channels: 2,
    bitrate: 132700,
    samplerate: 5200,
  },
};

const mediaCapabilitiesMapper: {
  [key: string]: {
    powerEfficient: boolean;
    smooth: boolean;
    supported: boolean;
  };
} = {
  "audio/mp3": {
    powerEfficient: true,
    smooth: true,
    supported: true,
  },
};

describe("useMediaCapabilitiesDecodingInfo", () => {
  test("should return supported flag on unsupported platforms", () => {
    const {
      useMediaCapabilitiesDecodingInfo,
    } = require("./media-capabilities");
    const { result } = renderHook(() =>
      useMediaCapabilitiesDecodingInfo(mediaDecodingConfig)
    );

    expect(result.current.supported).toEqual(false);
  });

  test("should return supported flag on unsupported platforms and no config given", () => {
    const {
      useMediaCapabilitiesDecodingInfo,
    } = require("./media-capabilities");
    const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo());

    expect(result.current.supported).toEqual(false);
  });

  test("should return initialMediaCapabilitiesInfo for unsupported", () => {
    const initialMediaCapabilitiesInfo = {
      supported: true,
      smooth: false,
      powerEfficient: true,
    };

    const {
      useMediaCapabilitiesDecodingInfo,
    } = require("./media-capabilities");
    const { result } = renderHook(() =>
      useMediaCapabilitiesDecodingInfo(
        mediaDecodingConfig,
        initialMediaCapabilitiesInfo
      )
    );

    expect(result.current.mediaCapabilitiesInfo.supported).toBe(true);
    expect(result.current.mediaCapabilitiesInfo.smooth).toEqual(false);
    expect(result.current.mediaCapabilitiesInfo.powerEfficient).toEqual(true);
  });

  test("should return supported flag when no config given", async () => {
    const originalError = console.error;
    console.error = jest.fn();

    const mockDecodingInfo = jest.fn().mockImplementation(() =>
      Promise.resolve({
        supported: true,
      })
    );

    // @ts-ignore
    global.navigator.mediaCapabilities = {
      decodingInfo: mockDecodingInfo,
    };

    const {
      useMediaCapabilitiesDecodingInfo,
    } = require("./media-capabilities");

    try {
      const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo());
      await waitFor(() => expect(result.current.supported).toEqual(true));
    } finally {
      console.error = originalError;
    }
  });

  test("should return mediaCapabilitiesInfo for given media configuration", async () => {
    const originalError = console.error;
    console.error = jest.fn();

    const mockDecodingInfo = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ...mediaCapabilitiesMapper[mediaDecodingConfig.audio.contentType],
      })
    );

    // @ts-ignore
    global.navigator.mediaCapabilities = {
      decodingInfo: mockDecodingInfo,
    };

    const {
      useMediaCapabilitiesDecodingInfo,
    } = require("./media-capabilities");

    try {
      const { result } = renderHook(() =>
        useMediaCapabilitiesDecodingInfo(mediaDecodingConfig)
      );
      await waitFor(() => {
        expect(result.current.mediaCapabilitiesInfo.powerEfficient).toEqual(
          true
        );
        expect(result.current.mediaCapabilitiesInfo.smooth).toEqual(true);
        expect(result.current.mediaCapabilitiesInfo.supported).toEqual(true);
      });
    } finally {
      console.error = originalError;
    }
  });
});
