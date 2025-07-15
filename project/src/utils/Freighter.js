// Freighter.js

export const checkConnection = async () => {
  return typeof window.freighterApi !== "undefined";
};

export const retrievePublicKey = async () => {
  return await window.freighterApi.getPublicKey();
};

