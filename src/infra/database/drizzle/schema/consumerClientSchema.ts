import { pgTable, boolean, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const consumerClient = pgTable('clients', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  docType: text('docType').notNull().unique(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  juridicalPerson: boolean('juridicalPerson').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
