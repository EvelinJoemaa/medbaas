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

    @OneToMany((type) => Patient, (patient)=> patient.doctor)
    patients!: Patient[];

    @OneToMany((type) => Prescription, (prescription)=> prescription.doctor)
    prescriptions!: Prescription[];

    @OneToMany((type) => OfficeVisit, (officevisit)=> officevisit.doctor)
    officevisits!: OfficeVisit[];

    @OneToMany((type) => HospitalAffiliation, (hospitalaffiliation)=> hospitalaffiliation.doctor)
    hospitalaffiliations!: HospitalAffiliation[];

    @OneToMany((type) => PrimaryDoctorHistory, (primarydoctorhistory)=> primarydoctorhistory.doctor)
    primarydoctorhistorys!: PrimaryDoctorHistory[];
}