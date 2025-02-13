import { elizaLogger } from '@elizaos/core';
import {
  LicenseTerms,
  StoryClient,
  StoryConfig,
  WIP_TOKEN_ADDRESS,
} from '@story-protocol/core-sdk';
import { http, zeroAddress, zeroHash } from 'viem';
import { Address, privateKeyToAccount } from 'viem/accounts';

// Docs: https://docs.story.foundation/docs/deployed-smart-contracts
export const RoyaltyPolicyLAP: Address = '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E';

export const getClient = (): { client: StoryClient; account: any } => {
  try {
    const RPCProviderUrl = process.env.RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io';
    const privateKey: Address = `0x${process.env.STORY_PRIVATE_KEY}`;
    if (!privateKey) throw new Error('STORY_PRIVATE_KEY not configured');
    if (!RPCProviderUrl) throw new Error('RPC_PROVIDER_URL not configured');
    const account = privateKeyToAccount(privateKey as Address);
    const config: StoryConfig = {
      account: account,
      transport: http(RPCProviderUrl),
      chainId: 'aeneid',
    };
    return {
      client: StoryClient.newClient(config),
      account,
    };
  } catch (e) {
    elizaLogger.error(e.message);
    throw e;
  }
};

export function createCommercialRemixTerms(terms: {
  commercialRevShare: number;
  defaultMintingFee: number;
  uri?: string;
}): LicenseTerms {
  return {
    transferable: true,
    royaltyPolicy: RoyaltyPolicyLAP,
    defaultMintingFee: BigInt(terms.defaultMintingFee),
    expiration: BigInt(0),
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: zeroAddress,
    commercialRevShare: terms.commercialRevShare,
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt(0),
    currency: WIP_TOKEN_ADDRESS,
    uri: terms.uri || '',
  };
}

export const defaultLicensingConfig = {
  isSet: false,
  mintingFee: BigInt(0),
  licensingHook: zeroAddress,
  hookData: zeroHash,
  commercialRevShare: 0,
  disabled: false,
  expectMinimumGroupRewardShare: 0,
  expectGroupRewardPool: zeroAddress,
};
