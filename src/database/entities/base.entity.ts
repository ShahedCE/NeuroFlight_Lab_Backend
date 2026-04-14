import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntityWithTimestamps{
    @PrimaryGeneratedColumn('uuid') // auto-generated uuid id
    id?: string;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt?: Date;
    
   @UpdateDateColumn({type: 'timestamptz'})
    updatedAt?: Date;   

}