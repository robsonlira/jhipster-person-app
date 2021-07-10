import * as dayjs from 'dayjs';
import { IPhone } from 'app/entities/phone/phone.model';

export interface IPerson {
  id?: number;
  firstName?: string;
  lastName?: string;
  cpf?: string;
  birthDate?: dayjs.Dayjs;
  phones?: IPhone[] | null;
}

export class Person implements IPerson {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public cpf?: string,
    public birthDate?: dayjs.Dayjs,
    public phones?: IPhone[] | null
  ) {}
}

export function getPersonIdentifier(person: IPerson): number | undefined {
  return person.id;
}
