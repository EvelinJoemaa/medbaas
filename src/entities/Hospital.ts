import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Hospitals extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    HospitalID!: number;

    @Column({ type: "varchar", length: 50 })
    Location!: string;

    @Column({ type: "varchar", length: 50 })
    ContactInformation!: string;
}