import { useState, useEffect } from 'react';

/**
 * @usecase 
 * This hook can be used to check if we can play a certain content type. For example, Safari does not support WebM so we want to fallback to MP4 but if Safari at some point does support WebM it will automatically load WebM videos.
 * @example
 * const audioFileConfiguration = {
    type: "file",
    audio: {
      contentType: "audio/mp3",
      channels: 2,
      bitrate: 132700,
      samplerate: 5200,
    },
  };
  const initialMediaCapabilitiesInfo = { powerEfficient: true };

  const { supported, mediaCapabilitiesInfo } = useMediaCapabilitiesDecodingInfo(
    audioFileConfiguration,
    initialMediaCapabilitiesInfo
  );
 * @param mediaDecodingConfig
 * @param initialMediaCapabilitiesInfo 
 * @returns 
 */
const useMediaCapabilitiesDecodingInfo = (
  mediaDecodingConfig: {
    type: MediaDecodingType;
    video: {
      contentType: string;
      width: number;
      height: number;
      bitrate: number;
      framerate: number;
    };
  },
  initialMediaCapabilitiesInfo?: {
    keySystemAccess?: MediaKeySystemAccess | null;
    powerEfficient?: boolean;
    smooth?: boolean;
    supported?: boolean;
  }
) => {
  const supported =
    typeof navigator !== 'undefined' && 'mediaCapabilities' in navigator;
  const [mediaCapabilitiesInfo, setMediaCapabilitiesInfo] = useState(
    initialMediaCapabilitiesInfo
  );

  useEffect(() => {
    supported &&
      navigator.mediaCapabilities
        .decodingInfo(mediaDecodingConfig)
        .then(setMediaCapabilitiesInfo)
        .catch((error) => console.error(error));
  }, [mediaDecodingConfig]);

  return { supported, mediaCapabilitiesInfo };
};

export { useMediaCapabilitiesDecodingInfo };
