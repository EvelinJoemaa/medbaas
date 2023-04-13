import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Doctors extends BaseEntity{
    @PrimaryGeneratedColumn({ type: "int" })
    doctorID!: number;

    @Column({ type: "varchar", length: 50 })
    specialty!: string;

    @Column({ type: "int" })
    hospitals!: number;

    @Column({ type: "int" })
    phoneNumber!: number;

    @Column({ type: "varchar" })
    address!: string;
}