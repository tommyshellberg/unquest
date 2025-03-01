// Set the test environment
process.env.NODE_ENV = "test";

// Mock expo-constants
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      apiUrl: "http://test-api-url.com",
    },
  },
}));

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock axios - define the mock directly inside the factory function
jest.mock("axios", () => {
  // Create request and response interceptor mocks
  const requestInterceptorMock = {
    onFulfilled: jest.fn(),
    onRejected: jest.fn(),
  };

  const responseInterceptorMock = {
    onFulfilled: jest.fn(),
    onRejected: jest.fn(),
  };

  return {
    create: jest.fn(() => {
      // Create the axios instance mock
      const instance = {
        interceptors: {
          request: {
            use: jest.fn((onFulfilled, onRejected) => {
              // Wrap onFulfilled to ensure it always returns a config object
              const wrappedOnFulfilled = async (config) => {
                const result = await onFulfilled(config);
                return result || config;
              };
              requestInterceptorMock.onFulfilled = wrappedOnFulfilled;
              requestInterceptorMock.onRejected = onRejected;
              return 0; // Return interceptor id
            }),
            eject: jest.fn(),
          },
          response: {
            use: jest.fn((onFulfilled, onRejected) => {
              // Wrap onRejected to ensure a proper promise is returned
              const wrappedOnRejected = async (error) => {
                return onRejected
                  ? await onRejected(error)
                  : Promise.reject(error);
              };
              responseInterceptorMock.onFulfilled = onFulfilled;
              responseInterceptorMock.onRejected = wrappedOnRejected;
              return 0; // Return interceptor id
            }),
            eject: jest.fn(),
          },
        },
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        defaults: {
          baseURL: "http://test-api-url.com",
          headers: {
            "Content-Type": "application/json",
          },
        },
        // Store the interceptors for testing
        _requestInterceptor: requestInterceptorMock,
        _responseInterceptor: responseInterceptorMock,
      };

      return instance;
    }),
  };
});

// Suppress React Native warnings
jest.mock("react-native/Libraries/LogBox/LogBox", () => ({
  ignoreLogs: jest.fn(),
}));

// Mock the Expo Router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  Link: "Link",
}));

// Silence console errors and warnings in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};
