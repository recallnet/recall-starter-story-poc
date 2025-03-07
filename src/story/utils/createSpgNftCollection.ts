import { Address, Hex } from 'viem';
import { elizaLogger } from '@elizaos/core';
import { getClient } from '../utils/utils.ts';

export const createSpgCollection = async function (): Promise<Address | null> {
  const { client, account } = getClient();

  try {
    // Send transaction to create the NFT collection
    const newCollection = await client.nftClient.createNFTCollection({
      name: 'Recall Logs',
      symbol: 'RECALL',
      isPublicMinting: true,
      mintOpen: true,
      contractURI: '',
      mintFeeRecipient: account.address as Address,
    });

    elizaLogger.info(`Transaction sent: ${newCollection.txHash}`);

    // Listen for the CollectionCreated event
    return new Promise((resolve, reject) => {
      const unwatch = client.nftClient.registrationWorkflowsClient.watchCollectionCreatedEvent(
        (txHash: Hex, ev: Partial<{ spgNftContract: Address }>) => {
          if (txHash === newCollection.txHash && ev.spgNftContract) {
            elizaLogger.info(`✅ New SPG NFT Collection deployed at: ${ev.spgNftContract}`);
            unwatch(); // Stop watching the event
            resolve(ev.spgNftContract);
          }
        },
      );

      // Timeout in case the event is never received
      setTimeout(() => {
        elizaLogger.error('❌ CollectionCreated event not received in time');
        unwatch(); // Stop watching the event
        reject(new Error('CollectionCreated event timeout'));
      }, 60000); // 60 seconds timeout
    });
  } catch (error) {
    elizaLogger.error(`❌ Error creating SPG NFT collection: ${error.message}`);
    return null;
  }
};
