import {Entity, BaseEntity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class HospitalAffiliations extends BaseEntity{
    @PrimaryColumn({ type: "datetime" })
    dateOfAffiliation!: Date;

    @Column({ type: "int" })
    doctorID!: number;

    @Column({ type: "int" })
    hospitalID!: number;
}