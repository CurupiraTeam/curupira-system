import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('example')
export class Example {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;
}
