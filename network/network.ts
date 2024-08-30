import { useState, useEffect } from "react";

declare namespace navigator {
  const connection: {
    downlink: number;
    effectiveType: string;
    onchange: any;
    rtt: number;
    saveData: boolean;
    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => void;
    removeEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ) => void;
  };
}

let unsupported: boolean;

const useNetworkStatus = (initialEffectiveConnectionType?: string) => {
  if (
    typeof navigator !== "undefined" &&
    "connection" in navigator &&
    "effectiveType" in navigator.connection
  ) {
    unsupported = false;
  } else {
    unsupported = true;
  }

  const initialNetworkStatus: {
    unsupported?: boolean;
    effectiveConnectionType: string | undefined;
  } = {
    unsupported,
    effectiveConnectionType: unsupported
      ? initialEffectiveConnectionType
      : navigator.connection.effectiveType,
  };

  const [networkStatus, setNetworkStatus] = useState(initialNetworkStatus);

  useEffect(() => {
    if (!unsupported) {
      const navigatorConnection = navigator.connection;
      const updateECTStatus = () => {
        setNetworkStatus({
          effectiveConnectionType: navigatorConnection.effectiveType,
        });
      };
      navigatorConnection.addEventListener("change", updateECTStatus);
      return () => {
        navigatorConnection.removeEventListener("change", updateECTStatus);
      };
    }
  }, []);

  return { ...networkStatus, setNetworkStatus };
};

export { useNetworkStatus };
