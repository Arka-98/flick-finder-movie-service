import { RolesEnum } from '@flick-finder/common';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { KafkaContext, RpcException } from '@nestjs/microservices';

export class ConsumerGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToRpc();
    const kafkaContext = ctx.getContext<KafkaContext>();
    const accessToken = kafkaContext.getMessage().headers['access_token'];

    if (!accessToken) {
      throw new RpcException('Unauthorized');
    }

    try {
      await this.jwtService.verifyAsync<{
        sub: string;
        username: string;
        role: RolesEnum;
      }>(accessToken.toString(), {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      throw new RpcException(error.message);
    }

    return true;
  }
}
