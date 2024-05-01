import { Customer } from './customer';

export interface CustomerRepository {
  getById(id: string): Promise<Customer | null>;
}
