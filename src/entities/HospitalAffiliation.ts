import {Entity, BaseEntity, PrimaryColumn, ManyToOne} from "typeorm";
import {Doctor} from "./Doctor";
import {Hospital} from "./Hospital";

@Entity()
export class HospitalAffiliation extends BaseEntity {
    @PrimaryColumn({type: "bigint"})
    dateOfAffiliation!: number;

    @ManyToOne(() => Doctor, doctor => doctor.hospitalAffiliations)
    doctor!: Doctor;

    @ManyToOne(() => Hospital, hospital => hospital.hospitalAffiliations)
    hospital!: Hospital;
}