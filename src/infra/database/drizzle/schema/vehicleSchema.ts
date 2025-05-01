import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { consumerClient } from './consumerClientSchema';

export const vehicle = pgTable('vehicles', {
  id: uuid('id').primaryKey(),
  clientId: uuid('client_id')
    .notNull()
    .references(() => consumerClient.id),
  plate: text('plate').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
