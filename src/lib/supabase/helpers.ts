import { supabaseAdmin, TABLES } from './server';

export function generateId(): string {
  const ticks = new Date(2025, 3, 30).getTime();
  const ans = Date.now() - ticks;
  const randomPart = Math.floor(Math.random() * 9000) + 1000;
  return (ans.toString(16) + randomPart.toString()).toUpperCase();
}

export async function createDocument<T extends object>(
  table: string,
  data: T
): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from(table)
    .insert({ ...data, id, createdAt: now, updatedAt: now });

  if (error) {
    console.error(`Create document error [${table}]:`, error);
    throw new Error(error.message);
  }

  return id;
}

export async function getDocument<T>(
  table: string,
  id: string
): Promise<T | null> {
  const { data, error } = await supabaseAdmin
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error(`Get document error [${table}]:`, error);
    throw new Error(error.message);
  }

  return data as T;
}

export async function updateDocument<T extends object>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<boolean> {
  const { error, count } = await supabaseAdmin
    .from(table)
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error(`Update document error [${table}]:`, error);
    throw new Error(error.message);
  }

  return true;
}

export async function deleteDocument(
  table: string,
  id: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Delete document error [${table}]:`, error);
    throw new Error(error.message);
  }

  return true;
}

export interface QueryOptions {
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  where?: {
    field: string;
    operator: string;
    value: unknown;
  }[];
  select?: string;
}

export async function getAllDocuments<T>(
  table: string,
  options?: QueryOptions
): Promise<T[]> {
  let query = supabaseAdmin
    .from(table)
    .select(options?.select || '*');

  if (options?.where) {
    for (const condition of options.where) {
      const { field, operator, value } = condition;
      switch (operator) {
        case '==':
          if (value === null) {
            query = query.is(field, null);
          } else {
            query = query.eq(field, value);
          }
          break;
        case '!=':
          query = query.neq(field, value);
          break;
        case '>':
          query = query.gt(field, value);
          break;
        case '>=':
          query = query.gte(field, value);
          break;
        case '<':
          query = query.lt(field, value);
          break;
        case '<=':
          query = query.lte(field, value);
          break;
        case 'in':
          query = query.in(field, value as unknown[]);
          break;
        default:
          query = query.eq(field, value);
      }
    }
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, {
      ascending: options.orderDirection !== 'desc',
    });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Get all documents error [${table}]:`, error);
    throw new Error(error.message);
  }

  return (data || []) as T[];
}

export async function countDocuments(
  table: string,
  where?: {
    field: string;
    operator: string;
    value: unknown;
  }[]
): Promise<number> {
  let query = supabaseAdmin
    .from(table)
    .select('*', { count: 'exact', head: true });

  if (where) {
    for (const condition of where) {
      const { field, operator, value } = condition;
      switch (operator) {
        case '==':
          if (value === null) {
            query = query.is(field, null);
          } else {
            query = query.eq(field, value);
          }
          break;
        case '!=':
          query = query.neq(field, value);
          break;
        case '>':
          query = query.gt(field, value);
          break;
        case '<':
          query = query.lt(field, value);
          break;
        default:
          query = query.eq(field, value);
      }
    }
  }

  const { count, error } = await query;

  if (error) {
    console.error(`Count documents error [${table}]:`, error);
    throw new Error(error.message);
  }

  return count || 0;
}

export { TABLES };
