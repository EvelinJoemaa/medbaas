import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Drugs extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    DrugID!: number;

    @Column({ type: "varchar", length: 50 })
    DrugName!: string;

    @Column({ type: "varchar", length: 50 })
    DrugPurpose!: string;

    @Column({ type: "varchar", length: 50 })
    DrugUse!: string;

    @Column({ type: "varchar", length: 50 })
    SideEffects!: string;
}