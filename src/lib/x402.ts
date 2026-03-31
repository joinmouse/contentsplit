import { x402ResourceServer } from "@x402/next";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import type { RouteConfig } from "@x402/core/server";

const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://x402.org/facilitator";
const EVM_ADDRESS = (process.env.EVM_ADDRESS || "0xae18a37156e885c156D76f356C48447957433ae0") as `0x${string}`;
const NETWORK = "eip155:84532"; // Base Sepolia

const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
export const server = new x402ResourceServer(facilitatorClient)
  .register(NETWORK, new ExactEvmScheme());

// Content generation: $0.01 per request
export const generateRoute: RouteConfig = {
  accepts: [{
    scheme: "exact",
    price: "$0.01",
    network: NETWORK,
    payTo: EVM_ADDRESS,
  }],
  description: "AI content repurposing — generate Twitter threads, LinkedIn posts, video scripts, and newsletters",
  mimeType: "application/json",
};
