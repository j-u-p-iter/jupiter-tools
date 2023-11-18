export const baseTsConfigContent = {
  compilerOptions: {
    skipLibCheck: true,
    module: "nodenext",
    moduleDetection: "force",
    sourceMap: true,
    target: "ES2022",
    strict: true,
    allowSyntheticDefaultImports: true,
    jsx: "react",
    noUnusedLocals: true,
    noUnusedParameters: true,
    noImplicitReturns: true,
    noImplicitOverride: true,
    noFallthroughCasesInSwitch: true,
    noUncheckedIndexedAccess: true,
    declaration: true,
    pretty: true,
    forceConsistentCasingInFileNames: true,
    types: ["vitest/globals"],
    outDir: "dist",
  },
};
