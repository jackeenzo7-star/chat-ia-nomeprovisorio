/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: {
        jsx: "react-jsx",
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        target: "es2023",
        lib: ["ES2023", "DOM"],
        types: ["jest"],
        skipLibCheck: true,
        allowImportingTsExtensions: true,
        noEmit: true,
      },
    }],
  },
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/src/__mocks__/styleMock.ts",
  },
};
