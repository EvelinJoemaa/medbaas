import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Drugs extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    drugID!: number;

    @Column({ type: "varchar", length: 50 })
    drugName!: string;

    @Column({ type: "varchar", length: 50 })
    drugPurpose!: string;

    @Column({ type: "varchar", length: 50 })
    drugUse!: string;

    @Column({ type: "varchar", length: 50 })
    sideEffects!: string;
}