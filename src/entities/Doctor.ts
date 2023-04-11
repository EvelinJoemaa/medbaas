import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Doctors extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    DoctorID!: number;

    @Column({ type: "varchar", length: 50 })
    Specialty!: string;

    @Column({ type: "int" })
    Hospitals!: number;

    @Column({ type: "int" })
    PhoneNumber!: number;

    @Column({ type: "varchar" })
    InsuranceHolderID!: string;
}