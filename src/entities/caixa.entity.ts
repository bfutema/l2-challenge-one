import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PedidoCaixa } from './pedido-caixa.entity';

@Entity('caixas')
export class Caixa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nome: string;

  @Column('int')
  altura: number;

  @Column('int')
  largura: number;

  @Column('int')
  comprimento: number;

  @Column('int')
  volume: number;

  @OneToMany(() => PedidoCaixa, (pedidoCaixa) => pedidoCaixa.caixa)
  pedidoCaixas: PedidoCaixa[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
