import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Patient} from "./Patient";
import {Doctor} from "./Doctor";

@Entity()
export class OfficeVisit extends BaseEntity {
    @PrimaryColumn({type: "bigint"})
    dateOfVisit!: number;

    @PrimaryColumn({type: "int"})
    patientId!: number;
    @ManyToOne(() => Patient, patient => patient.officeVisits)
    @JoinColumn({name: "patientId"})

    @PrimaryColumn({type: "int"})
    doctorId!: number;
    @ManyToOne(() => Doctor, doctor => doctor.officeVisits)
    @JoinColumn({name: "doctorId"})

    @Column({type: "varchar", length: 50, nullable: true})
    symptoms!: string;

    @Column({type: "varchar", length: 50, nullable: true})
    initialDiagnosis!: string;

    @Column({type: "varchar", length: 50, nullable: true})
    diagnosisStatus!: string;

    @Column({type: "int", nullable: true})
    bloodPressure!: number;

    @Column({ type: "int", nullable: true })
    weight!: number;

    @Column({ type: "int", nullable: true })
    height!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    diagnosis!: string;
}