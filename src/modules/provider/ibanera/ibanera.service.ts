import { Injectable } from '@nestjs/common';
import { totp } from 'otplib';
import { HashAlgorithms } from 'otplib/core';
import axios from 'axios';

@Injectable()
export class IbaneraProviderService {
  constructor() {}

  private authToken: string | null = null;
  private tokenExpiry: number | null = null;
  private ibaneraServiceUrl = process.env.IBANERA_SERVICE_PROVIDER;

  async generateOTPToken(): Promise<string> {
    totp.options = { digits: 6, algorithm: HashAlgorithms.SHA1, step: 30 };
    return totp.generate(process.env.IBANERA_JWT_SECRET);
  }

  async login(otpToken: string): Promise<string> {
    const ibaneraAuthUrl = process.env.IBANERA_AUTH_PROVIDER;
    const loginResponse = await axios.post(`${ibaneraAuthUrl}`, {
      username: process.env.IBANERA_USERNAME,
      password: process.env.IBANERA_PASSWORD,
      otp: otpToken,
    });

    this.authToken = loginResponse?.data?.details?.accessToken;
    this.tokenExpiry =
      Date.now() + Number(loginResponse?.data?.details?.expiresIn) * 1000;
    return this.authToken;
  }

  async getAuthToken(): Promise<any> {
    const otpToken = await this.generateOTPToken();
    if (this.authToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return {
        otp: otpToken,
        authToken: this.authToken,
      };
    }

    return {
      otp: this.generateOTPToken(),
      authToken: this.login(otpToken),
    };
  }

  async call(url, body, method): Promise<any> {
    let response = await this.getAuthToken();
    switch (method) {
      case 'POST':
        response = await axios.post(`${this.ibaneraServiceUrl}${url}`, body, {
          headers: {
            Authorization: `Bearer ${response?.authToken}`,
            otp: `${response?.otp}`,
          },
        });
      case 'GET':
        response = await axios.get(`${this.ibaneraServiceUrl}${url}`, {
          params: body,
          headers: {
            Authorization: `Bearer ${response?.authToken}`,
            otp: `${response?.otp}`,
          },
        });
    }

    return response;
  }

  async createAccount(customer_id: string, asset_name: string) {
    const body = {
      customersId: customer_id,
      name: asset_name,
      asset: asset_name,
    };

    const response = await this.call(
      '/api/v2/customer/accounts/create', // USAMA & Farook All API call urls to be added to one config file, enum or function for better management
      body,
      'POST',
    );

    return response.data;
  }
}
