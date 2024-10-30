import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  HttpException,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ensure the path to JwtAuthGuard is correct
import { Request } from 'express';
import { AllowApiCall } from 'src/common/decorators/allow-api-call.decorator';
import { Asset } from '../asset/entities/asset.entity';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @AllowApiCall()
  @Post('estimate_gas')
  async estimateGas(
    @Req() req: Request,
    @Body()
    body: {
      user_id?: string;
      company_id?: string;
      blockchain?: Asset;
      to?: string;
      from?: string;
      amount?: number;
    },
  ) {
    const { user_id, company_id, blockchain, to, from, amount } = body;
    try {
      const transaction = await this.transactionService.estimateGas(
        req,
        user_id,
        company_id,
        blockchain,
        to,
        from,
        amount,
      );
      return transaction;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @AllowApiCall()
  @Post('estimate_execution_gas')
  async estimateExecutionGas(
    @Req() req: Request,
    @Body()
    body: {
      user_id?: string;
      company_id?: string;
      token?: Asset;
      to?: string;
      from?: string;
      amount?: number;
    },
  ) {
    const { user_id, company_id, token, to, from, amount } = body;
    try {
      const transaction = await this.transactionService.estimateExecutionGas(
        req,
        user_id,
        company_id,
        token,
        to,
        from,
        amount,
      );
      return transaction;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @AllowApiCall()
  @Post('send/external_native')
  async sendExternalNative(
    @Req() req: Request,
    @Body()
    body: {
      user_id?: string;
      company_id?: string;
      blockchain?: Asset;
      from?: string;
      to?: string;
      amount?: number;
      chain_fee?: number;
    },
  ) {
    const { user_id, company_id, blockchain, to, from, amount, chain_fee } =
      body;
    try {
      const transaction = await this.transactionService.sendExternalNative(
        req,
        user_id,
        company_id,
        blockchain,
        to,
        from,
        amount,
        chain_fee,
      );
      return transaction;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @AllowApiCall()
  @Post('send/external_token')
  async sendExternalToken(
    @Req() req: Request,
    @Body()
    body: {
      user_id?: string;
      company_id?: string;
      token?: Asset;
      from?: string;
      to?: string;
      amount?: number;
      chain_fee?: number;
    },
  ) {
    const { user_id, company_id, token, to, from, amount, chain_fee } = body;
    try {
      const transaction = await this.transactionService.sendExternalToken(
        req,
        user_id,
        company_id,
        token,
        to,
        from,
        amount,
        chain_fee,
      );
      return transaction;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
