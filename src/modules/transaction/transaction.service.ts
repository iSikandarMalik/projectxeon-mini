import { Injectable } from '@nestjs/common';
import { ThirteenxProviderService } from '../provider/thirteenx/thirteenx.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { Asset } from '../asset/entities/asset.entity';
import { Request } from 'express';
@Injectable()
export class TransactionService {
  constructor(
    private readonly thirteenxProviderService: ThirteenxProviderService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async feeScheme(
    amount?: number,
    chain_fee?: number,
    asset?: Asset,
  ): Promise<number> {
    return 0.1 * chain_fee;
  }

  async companyFeeScheme(
    amount?: number,
    chain_fee?: number,
    asset?: Asset,
  ): Promise<number> {
    return 0.1 * chain_fee;
  }

  async estimateGas(
    req: Request,
    user_id: string,
    company_id: string,
    asset?: Asset,
    to?: string,
    from?: string,
    amount?: number,
  ): Promise<any> {
    const user = await this.authService.me(req);
    const companyUser =
      company_id && user_id
        ? this.userService.findByUserId(user_id, company_id)
        : false;
    try {
      /**** Reminder
       * Every quote needs to be timed by the backend when giving customers the gas price
       * upon executing the actual transaction the quote needs to be checked if its upto date or not
       * ***/
      const chain_fee = await this.thirteenxProviderService.estimateGas(
        user,
        companyUser,
        asset,
        to,
        from,
        amount,
      );

      const platform_fee = await this.feeScheme(amount, chain_fee, asset);
      const company_fee = await this.companyFeeScheme(amount, chain_fee, asset);

      return {
        chain_fee: chain_fee,
        platform_fee: platform_fee,
        company_fee: company_fee,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message || 'Failed to fetch wallets');
    }
  }

  async estimateExecutionGas(
    req: Request,
    user_id: string,
    company_id: string,
    asset?: Asset,
    to?: string,
    from?: string,
    amount?: number,
  ): Promise<any> {
    const user = await this.authService.me(req);
    const companyUser =
      company_id && user_id
        ? this.userService.findByUserId(user_id, company_id)
        : false;
    try {
      /**** Reminder
       * Every quote needs to be timed by the backend when giving customers the gas price
       * upon executing the actual transaction the quote needs to be checked if its upto date or not
       ****/
      const chain_fee =
        await this.thirteenxProviderService.estimateExecutionGas(
          user,
          companyUser,
          asset,
          to,
          from,
          amount,
        );

      const platform_fee = await this.feeScheme(amount, chain_fee, asset);
      const company_fee = await this.companyFeeScheme(amount, chain_fee, asset);

      return {
        chain_fee: chain_fee,
        platform_fee: platform_fee,
        company_fee: company_fee,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message || 'Failed to fetch wallets');
    }
  }

  async sendExternalNative(
    req: Request,
    user_id: string,
    company_id: string,
    asset?: Asset,
    to?: string,
    from?: string,
    amount?: number,
    chain_fee?: number,
  ): Promise<any> {
    const user = await this.authService.me(req);
    const companyUser =
      company_id && user_id
        ? this.userService.findByUserId(user_id, company_id)
        : false;
    try {
      const platform_fee = await this.feeScheme(amount, chain_fee, asset);
      const company_fee = await this.companyFeeScheme(amount, chain_fee, asset);
      return await this.thirteenxProviderService.sendNativeCurrency(
        user,
        companyUser,
        asset,
        to,
        from,
        amount,
        chain_fee,
        platform_fee,
        company_fee,
      );
    } catch (error) {
      console.log(error);
      throw new Error(error.message || 'Failed to fetch wallets');
    }
  }

  async sendExternalToken(
    req: Request,
    user_id: string,
    company_id: string,
    asset?: Asset,
    to?: string,
    from?: string,
    amount?: number,
    chain_fee?: number,
  ): Promise<any> {
    const user = await this.authService.me(req);
    const companyUser =
      company_id && user_id
        ? this.userService.findByUserId(user_id, company_id)
        : false;
    try {
      const platform_fee = await this.feeScheme(amount, chain_fee, asset);
      const company_fee = await this.companyFeeScheme(amount, chain_fee, asset);
      return await this.thirteenxProviderService.sendTokenCurrency(
        user,
        companyUser,
        asset,
        to,
        from,
        amount,
        chain_fee,
        platform_fee,
        company_fee,
      );
    } catch (error) {
      console.log(error);
      throw new Error(error.message || 'Failed to fetch wallets');
    }
  }
}
