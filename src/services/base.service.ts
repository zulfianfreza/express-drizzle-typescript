import { MySqlTable } from 'drizzle-orm/mysql-core';
import { SQL } from 'drizzle-orm';
import {
  BaseRepository,
  CreateModel,
  DeleteOptions,
  Model,
  PaginatedResult,
  QueryOptions,
} from '../repositories/base.repository';

export abstract class BaseService<
  T extends Model,
  TTable extends MySqlTable,
  R extends BaseRepository<T, TTable>,
> {
  constructor(protected repository: R) {}

  async create(data: CreateModel<T>): Promise<T> {
    return this.repository.create(data);
  }

  async findById(id: string | number): Promise<T | null> {
    return this.repository.findById(id);
  }

  async findOne({ where }: QueryOptions<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }

  async findAll(options?: QueryOptions<T>): Promise<PaginatedResult<T>> {
    return this.repository.findAll(options);
  }

  async findAllWithoutPaginate(where?: Partial<T>): Promise<T[]> {
    return this.repository.findAllWithoutPaginate(where);
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    return this.repository.update(id, data);
  }

  async delete(id: string | number): Promise<boolean> {
    return this.repository.delete(id);
  }

  async deleteOptions(options: DeleteOptions): Promise<boolean> {
    return this.repository.deleteOptions(options);
  }

  async bulkDelete(ids: (string | number)[]): Promise<number> {
    return this.repository.bulkDelete(ids);
  }

  async query(sqlQuery: SQL): Promise<any[]> {
    return this.repository.query(sqlQuery);
  }
}
