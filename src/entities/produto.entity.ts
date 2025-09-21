import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  produto_id: string;

  @Column('int')
  altura: number;

  @Column('int')
  largura: number;

  @Column('int')
  comprimento: number;

  @Column('int')
  volume: number;

  @Column()
  pedido_id: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.produtos)
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
