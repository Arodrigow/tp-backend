import { Module } from '@nestjs/common';
import { AccessService } from './access.service';

@Module({
  exports:[AccessService],
  providers: [AccessService]
})
export class AccessModule {}
