export class Account {
  constructor(
    readonly customer_id: string,
    readonly isActive: boolean,
    readonly type: string,
    readonly creationDate: number
  ) {}
}
