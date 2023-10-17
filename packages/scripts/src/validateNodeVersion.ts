const MINOR_SUPPORTED_NODE_VERSION = 16;

const isIncorrectNodeVersion = () => {
  const nodeVersion = process.version.slice(1);

  return Number(nodeVersion) < MINOR_SUPPORTED_NODE_VERSION;
};

const validateNodeVersion = () => {
  if (isIncorrectNodeVersion()) {
    throw new Error(
      `You must run Node version ${MINOR_SUPPORTED_NODE_VERSION} or greater to run scripts within jupiter-scripts because we run untranspiled versions of scripts.`,
    );
  }
};

export { validateNodeVersion };
