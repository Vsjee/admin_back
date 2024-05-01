export class Customer {
  constructor(
    readonly uid: string,
    readonly fistName: string,
    readonly lastName: string,
    readonly cellphone: string,
    readonly email: string,
    readonly isActive: boolean,
    readonly creationDate: number,
    readonly modificationDate: number
  ) {}
}
