import type { MakeTransformedPrisma, MakeSerializedPrisma } from './types';
/** Transform object props value into Prisma-supported types */
export declare function transformPrisma<T extends Record<string, any>>(data: T, removeNullable?: boolean): MakeTransformedPrisma<T>;
/** Transform prisma result into JSON serializable types */
export declare function serializePrisma<T extends Record<string, any>>(data: T, removeNullable?: boolean): MakeSerializedPrisma<T>;
