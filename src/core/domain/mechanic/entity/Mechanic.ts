import Entity from "../../../generics/Entity";
import Identity from "../../../generics/Identity";
import { CPF } from "../objectValue/CPF";
import { Email } from "../objectValue/Email";

type MechanicProps = {
    name: string;
    email: Email;
    cpf: CPF;
    isAvaliable: boolean;
}

export class Mechanic extends Entity<MechanicProps> {
    private constructor(props: MechanicProps, id?: Identity) {
        super(props, id)
    }

    static create(props: MechanicProps, id?: Identity): Mechanic {
        return new Mechanic({ ...props }, id);
    }

    get name(): string {
        return this.properties.name;
    }

    get email(): Email {
        return this.properties.email;
    }

    get cpf(): CPF {
        return this.properties.cpf;
    }

    get isAvaliable(): boolean {
        return this.properties.isAvaliable;
    }

    setName(name: string): void {
        this.properties.name = name;
    }

    setEmail(email: Email): void {
        this.properties.email = email;
    }

    setCPF(cpf: CPF): void {
        this.properties.cpf = cpf;
    }

    setIsAvaliable(value: boolean): void {
        this.properties.isAvaliable = value;
    }
};