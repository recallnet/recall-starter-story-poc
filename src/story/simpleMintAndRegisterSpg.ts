import { GenerateIpMetadataParam, IpMetadata } from '@story-protocol/core-sdk';
import { uploadJSONToIPFS } from './utils/uploadToIpfs.ts';
import { createHash } from 'crypto';
import { elizaLogger } from '@elizaos/core';
import { createCommercialRemixTerms, defaultLicensingConfig } from './utils/utils.ts';
import { getClient } from './utils/utils.ts';

export const mintSpgWithPilTerms = async function (metadata: GenerateIpMetadataParam) {
  try {
    const spgNftContract = process.env.SPG_NFT_CONTRACT as `0x${string}`;

    const { client } = getClient();
    //
    // Docs: https://docs.story.foundation/docs/ipa-metadata-standard
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata(metadata);

    // 2. Set up your NFT Metadata
    //
    // Docs: https://eips.ethereum.org/EIPS/eip-721
    const nftMetadata = {
      name: `NFT representing ownership of ${metadata.additionalProperties.batchKey} Asset`,
      description: 'This NFT represents ownership of an IP Asset',
      bucketAddress: metadata.additionalProperties.bucketAddress,
    };

    // 3. Upload your IP and NFT Metadata to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex');
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex');

    // 4. Register the NFT as an IP Asset
    //
    // Docs: https://docs.story.foundation/docs/sdk-ipasset#mintandregisterip
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract,
      allowDuplicates: true,
      licenseTermsData: [
        {
          terms: createCommercialRemixTerms({ commercialRevShare: 50, defaultMintingFee: 0 }),
          licensingConfig: defaultLicensingConfig,
        },
      ],
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    });
    elizaLogger.info(
      `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`,
    );
    elizaLogger.info(
      `View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`,
    );
    return response;
  } catch (e) {
    elizaLogger.error(e.message);
    throw e;
  }
};
