let initialHardwareConcurrency: {
  unsupported: boolean;
  numberOfLogicalProcessors?: number;
};
if (typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator) {
  initialHardwareConcurrency = {
    unsupported: false,
    numberOfLogicalProcessors: navigator.hardwareConcurrency,
  };
} else {
  initialHardwareConcurrency = { unsupported: true };
}
const useHardwareConcurrency = () => {
  return { ...initialHardwareConcurrency };
};

export { useHardwareConcurrency };
