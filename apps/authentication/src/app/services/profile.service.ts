import { EntityManager } from "@mikro-orm/postgresql";
import { InjectEntityManager } from "@mikro-orm/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { UserEntity } from "@show-republic/entities";

@Injectable()
export class GetProfileService {
    private readonly logger = new Logger(GetProfileService.name);

    constructor(
        @InjectEntityManager('postgres')
        private readonly pgEm: EntityManager,
    ) { }

    async profile(currentUserId: string): Promise<Omit<UserEntity, 'password'>> {
        try {
            const userRepo = this.pgEm.fork().getRepository(UserEntity);

            this.logger.log(`Fetching profile for user: ${currentUserId}`);

            const user = await userRepo.findOne(
                { id: currentUserId },
                {
                    exclude: ['password'],
                }
            );

            if (!user) {
                this.logger.warn(`User not found: ${currentUserId}`);
                throw new RpcException('User not found');
            }

            this.logger.log(`Profile fetched successfully for user: ${currentUserId}`);
            return user;
        } catch (error: any) {
            this.logger.error(`Error fetching profile for user ${currentUserId}:`, error);
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException(`Failed to fetch user profile: ${error.message}`);
        }
    }
}