import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pedido } from './pedido.entity';
import { Caixa } from './caixa.entity';

@Entity('pedido_caixas')
export class PedidoCaixa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pedido_id: number;

  @Column({ nullable: true })
  caixa_id: number;

  @Column('text', { array: true })
  produtos: string[];

  @Column('text', { nullable: true })
  observacao: string;

  @ManyToOne(() => Pedido, (pedido) => pedido.pedidoCaixas)
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @ManyToOne(() => Caixa, (caixa) => caixa.pedidoCaixas)
  @JoinColumn({ name: 'caixa_id' })
  caixa: Caixa;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
