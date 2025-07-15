declare module "@stellar/freighter-api" {
  export function getPublicKey(): Promise<string>;
  export function signTransaction(xdr: string, options: {
    network: "PUBLIC" | "TESTNET";
  }): Promise<string>;
}
