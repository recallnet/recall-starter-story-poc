import { Address, http, zeroAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { StoryConfig, StoryClient } from '@story-protocol/core-sdk';
import { elizaLogger } from '@elizaos/core';

// Create a new SPG NFT collection before using `mintSpgWithPilTerms` to mint and register an IP Asset.

export const createSpgCollection = async function () {
  const RPCProviderUrl = process.env.RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io';

  const privateKey: Address = `0x${process.env.STORY_PRIVATE_KEY}`;
  if (!privateKey) throw new Error('STORY_PRIVATE_KEY not configured');
  const account = privateKeyToAccount(privateKey as Address);
  const config: StoryConfig = {
    account: account,
    transport: http(RPCProviderUrl),
    chainId: 'aeneid',
  };
  const client = StoryClient.newClient(config);

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
