import { Address } from 'viem';
import { elizaLogger } from '@elizaos/core';
import { getClient } from '../utils/utils.ts';

// Create a new SPG NFT collection before using `mintSpgWithPilTerms` to mint and register an IP Asset.

export const createSpgCollection = async function () {
  const { client, account } = getClient();

  const newCollection = await client.nftClient.createNFTCollection({
    name: 'Recall Logs',
    symbol: 'RECALL',
    isPublicMinting: true,
    mintOpen: true,
    contractURI: '',
    mintFeeRecipient: account.address as Address,
  });

  console.log(`New SPG NFT collection created at transaction hash ${newCollection.txHash}`);
  elizaLogger.info(`NFT contract address: ${JSON.stringify(newCollection.spgNftContract)}`);
};
