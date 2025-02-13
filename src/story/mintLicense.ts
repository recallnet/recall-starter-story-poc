import { elizaLogger } from '@elizaos/core';
import { getClient } from './utils/utils.ts';

export async function mintLicense() {
  const { client } = getClient();
  const response = await client.license.mintLicenseTokens({
    licenseTermsId: '95',
    licensorIpId: '0x24Ae3CC6b24b900f459CD0610462116fA57F8b6A',
    receiver: '0x514E3B94F0287cAf77009039B72C321Ef5F016E6', // optional. if not provided, it will go to the tx sender
    amount: 1,
    maxMintingFee: BigInt(0), // disabled
    maxRevenueShare: 100, // default
    txOptions: { waitForTransaction: true },
  });

  elizaLogger.info(
    `License Token minted at transaction hash ${response.txHash}, License IDs: ${response.licenseTokenIds}`,
  );
}
