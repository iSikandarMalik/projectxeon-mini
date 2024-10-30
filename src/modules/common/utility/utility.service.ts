import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { randomBytes } from 'crypto';

@Injectable()
export class UtilityService {
  private s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadToS3(
    bucket: string,
    key: string,
    body: Buffer | string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: bucket,
      Key: key,
      Body: body,
    };

    return this.s3.upload(params).promise();
  }

  generateSecureOtp(): string {
    const buffer = randomBytes(3);
    const otp = parseInt(buffer.toString('hex'), 16) % 1000000;
    return otp.toString().padStart(6, '0');
  }

  async deleteImageByUrl(imageUrl: string): Promise<void> {
    try {
      const { bucket, key } = this.parseS3Url(imageUrl);

      const params = {
        Bucket: bucket,
        Key: key,
      };

      await this.s3.deleteObject(params).promise();
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  private parseS3Url(url: string): { bucket: string; key: string } {
    const parsedUrl = new URL(url);
    const bucket = parsedUrl.hostname.split('.')[0];
    const key = parsedUrl.pathname.slice(1); // Remove leading '/'

    return { bucket, key };
  }
}
