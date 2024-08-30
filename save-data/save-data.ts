declare namespace navigator {
  export let connection: {
    downlink: number;
    effectiveType: string;
    onchange: any;
    rtt: number;
    saveData: boolean;
  };
}

let unsupported;

const useSaveData = (initialSaveData = null) => {
  if (
    typeof navigator !== 'undefined' &&
    'connection' in navigator &&
    'saveData' in navigator.connection
  ) {
    unsupported = false;
  } else {
    unsupported = true;
  }

  return {
    unsupported,
    saveData: unsupported
      ? initialSaveData
      : navigator.connection.saveData === true,
  };
};

export { useSaveData };
