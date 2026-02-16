import { Configuration } from '@azure/msal-browser'

const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: redirectUri,
    postLogoutRedirectUri: redirectUri,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        if (import.meta.env.DEV) {
          console.log(`[MSAL] ${message}`)
        }
      },
      piiLoggingEnabled: false,
      logLevel: 'Info',
    },
  },
}

export const loginRequest = {
  scopes: [
    `${import.meta.env.VITE_AZURE_CLIENT_ID}/.default`,
  ],
}

export const apiScopes = {
  scopes: [
    `${import.meta.env.VITE_AZURE_CLIENT_ID}/.default`,
  ],
}
