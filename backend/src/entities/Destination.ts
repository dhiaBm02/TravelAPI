import { object, string, date, array } from 'yup';

import { Collection, Entity, ManyToMany, OneToMany, Property, } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';
import { CreateTripDTO, Trip } from './Trip';

@Entity()
export class Destination extends BaseEntity {

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  activities?: string;

  @Property({ nullable: true })
  photos?: string;

  @Property()
  startDate: Date;

  @Property()
  endDate: Date;


  @ManyToMany(() => Trip, trip => trip.destinations, { owner: true })
  trips = new Collection<Trip>(this);

  constructor({ name, description, photos, startDate, endDate, activities }: CreateDestinationDTO) {
    super();
    this.name = name;
    this.description = description;
    this.photos = photos;
    this.startDate = startDate;
    this.endDate = endDate;
    this.activities = activities;
  }
}

export const CreateDestinationSchema = object({
  name: string().required(),
  //description: string().notRequired(),
  //photos: string().notRequired(),
  startDate: date().required(),
  endDate: date().required(),
  //activities: string().notRequired(),
  trips: array().of(object({
    id: string().required(),
  })).required().min(1),
});

export type CreateDestinationDTOTrip = Partial<Pick<Trip, 'id'>>;
export type CreateDestinationDTO = {
  name: string;
  description?: string;
  photos?: string;
  startDate: Date;
  endDate: Date;
  activities?: string;
  trips: CreateDestinationDTOTrip[];
};
