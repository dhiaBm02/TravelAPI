import { array, object, string, date } from 'yup';

import { ArrayCollection, Collection, DateTimeType, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';
import { Destination } from './Destination';

@Entity()
export class Trip extends BaseEntity {
  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  participants?: string;

  @Property({ nullable: true })
  image?: string;

  @Property()
  startDate: Date;

  @Property()
  endDate: Date;


  @ManyToMany(() => Destination, destination => destination.trips)
  destinations? = new Collection<Destination>(this);

  constructor({ name, startDate, endDate, description, participants, image }: CreateTripDTO) {
    super();
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
    this.participants = participants;
    this.image = image;
  }
}

export const CreateTripSchema = object({
  name: string().required(),
  //description: string().notRequired(),
  //image: string().notRequired(),
  startDate: date().required(),
  endDate: date().required(),
  //participants: string().notRequired(),
  destinations: array().of(object({
    id: string().required(),
  })).notRequired(),
});

export const DeleteDestinationFromRelationSchema = object({
  destinationIds: array().of(string()).required(),
});

export type CreateTripDTODestination = Partial<Pick<Destination, 'id' | 'name'>>;
export type CreateTripDTO = {
  name: string;
  description?: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  participants?: string;
  destinations?: CreateTripDTODestination[];
};