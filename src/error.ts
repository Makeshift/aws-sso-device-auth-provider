import { AccountInfo } from "@aws-sdk/client-sso"

export class AwsSsoDeviceAuthProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AwsSsoDeviceAuthProviderError';
  }
}

export class MultipleAccountsFoundError extends AwsSsoDeviceAuthProviderError {
  constructor(searchName: string, accountsFound: AccountInfo[]) {
    super(`More than one account found with name ${searchName}: ${accountsFound.map(account => account.accountName).join(', ')}`);
    this.name = 'MultipleAccountsFoundError';
  }
}
