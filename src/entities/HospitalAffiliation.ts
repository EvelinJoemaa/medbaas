import {Entity, BaseEntity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class HospitalAffiliations extends BaseEntity{
    @PrimaryColumn({ type: "datetime" })
    DateOfAffiliation!: Date;

    @Column({ type: "int" })
    DoctorID!: number;

    @Column({ type: "int" })
    HospitalID!: number;
}