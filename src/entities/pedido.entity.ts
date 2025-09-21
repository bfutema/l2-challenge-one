import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produto } from './produto.entity';
import { PedidoCaixa } from './pedido-caixa.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pedido_id: number;

  @OneToMany(() => Produto, (produto) => produto.pedido)
  produtos: Produto[];

  @OneToMany(() => PedidoCaixa, (pedidoCaixa) => pedidoCaixa.pedido)
  pedidoCaixas: PedidoCaixa[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
