import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const mechanic = pgTable('mechanics', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  cpf: text('cpf').notNull().unique(),
  isAvaliable: boolean('isAvaliable').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
