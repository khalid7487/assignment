import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../auth/User.entity";
import {CoreEntity} from "../commons/CoreEntity";

@Entity()
export class Movie extends CoreEntity {


    constructor(movie: Partial<Movie>) {
        super()
        Object.assign(this, movie)
    }

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: bigint

    @Column({type: "text"})
    name: string

    @Column({type: "text"})
    category: string
  
    @Column({type: "text", nullable: true})
    title: string

    @Column({type: "text", nullable: true})
    description: string

    @Column({type: "text", nullable: true})
    video_link: string


    @Column({default: 0})
    status: number          // 1, 2, 3, 4

    @Column({default: 0})
    rating: number          // 1, 2, 3, 4

    @ManyToOne(() => User, user => user.movies, {
        onDelete: 'CASCADE'
    })
    user: User;

}