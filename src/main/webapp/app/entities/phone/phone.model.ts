import { IPerson } from 'app/entities/person/person.model';
import { PhoneType } from 'app/entities/enumerations/phone-type.model';

export interface IPhone {
  id?: number;
  number?: string;
  phoneType?: PhoneType;
  person?: IPerson | null;
}

export class Phone implements IPhone {
  constructor(public id?: number, public number?: string, public phoneType?: PhoneType, public person?: IPerson | null) {}
}

export function getPhoneIdentifier(phone: IPhone): number | undefined {
  return phone.id;
}
