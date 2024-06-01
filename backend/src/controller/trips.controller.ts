import { Router } from 'express';

import { DateTimeType, wrap } from '@mikro-orm/core';

import { DI } from '..';
import { CreateTripDTO, CreateDestinationDTOTrip, CreateTripSchema, Trip } from '../entities';
import { createEvent, DateTime } from 'ics';

const router = Router({ mergeParams: true });

// GET /trips
// DONE: with query params name or date !!!
router.get('/', async (req, res) => {
  const { name, date } = req.query;
  let query: any = {};
  if (name) {
    query.name = { $ilike: `%${name}%` }; // Case-insensitive search for name
  }
  if (date) {
    let dateLike = date as string;
    console.log(dateLike);

    query.startDate = {
      $gte: new Date(dateLike),
      $lt: new Date(dateLike + 'T23:59:59.999'),
    }
  }

  try {
    const trips = await DI.tripRepository.find(query, { populate: ['destinations'] });
    return res.status(200).send(trips);
  } catch (error) {
    return res.status(500).send({ error: 'An error occurred while fetching trips.' });
  }
});

// POST /trips
router.post('/', async (req, res) => {
  const validatedData = await CreateTripSchema.validate(req.body).catch((e) => {
    res.status(400).json({ errors: e.errors });
  });
  if (!validatedData) {
    return;
  }
  const createTripDTO: CreateTripDTO = {
    ...validatedData,
    destinations: req.body.destinations || [], // Set destinations to an empty array if it is null or undefined
  };
  const trip = new Trip(createTripDTO);

  const destinationIds: any = [];
  // new destinations with object
  const newDestinations: any = [];
  if (createTripDTO.destinations) {
    for (const curDest of createTripDTO.destinations) {
      if (curDest.id) {
        destinationIds.push(curDest.id);
      }
    }

    const loadedDestinations = await DI.destinationRepository.find({ id: { $in: destinationIds } });
    const mergedDestinations = [...loadedDestinations, ...newDestinations];

    wrap(trip).assign({ destinations: mergedDestinations }, { em: DI.em });

    await DI.em.persistAndFlush(trip);
    await DI.tripRepository.populate(trip, ['destinations']);


  }
  else {
    await DI.em.persistAndFlush(trip);
  }

  res.status(201).send(trip);
});

// GET /trips/{id}
router.get('/:id', async (req, res) => {
  const trip = await DI.tripRepository.findOne(
    { id: req.params.id },
    { populate: ['destinations'] }
  );
  if (!trip) {
    return res.status(404).send({ message: 'Trip not found' });
  }

  res.status(200).send(trip);
});

// PUT /trips/{id}
router.put('/:id', async (req, res) => {
  try {
    const trip = await DI.tripRepository.findOne(req.params.id, {
      populate: ['destinations'],
    });

    if (!trip) {
      return res.status(404).send({ message: 'Trip not found' });
    }

    if (req.body.id) {
      delete req.body.id;
    }

    // before update the trip, check if the destinations are valid
    let destinationIds: any = [];
    if (req.body.destinations) {
      destinationIds = req.body.destinations.map((d: any) => d.id);
    }
    const destinations = await DI.destinationRepository.find({
      id: { $in: destinationIds }
    });

    // check if the destinations that gonna be deleted have other trips if not do not update the trip
    const tripDestinations = trip.destinations?.getItems().filter((d) => !destinationIds.includes(d.id));
    if (tripDestinations) {
      for (const destination of tripDestinations) {
        let trips = destination.trips;
        if (trips) {
          if (trips.length === 1) {
            return res.status(403).json({ errors: [`You can't delete this trip because it is the only trip for a destination`] });
          }
        }
      }
    }

    wrap(trip).assign({ ...req.body, destinations });
    await DI.em.flush();

    res.status(200).json(trip);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }

});

// DELETE /trips/{id}
router.delete('/:id', async (req, res) => {
  const existingTrips = await DI.tripRepository.findOne(req.params.id, {
    populate: ['destinations'],
  });
  console.log(existingTrips);

  if (!existingTrips) {
    return res.status(403).json({ errors: [`You can't delete this id`] });
  }

  // check if the trips all destinations have other trips if not do not delete the trip
  const destinations = await DI.destinationRepository.find({ trips: { id: req.params.id } }, { populate: ['trips'] });
  if (destinations) {
    for (const destination of destinations) {
      console.log(destination);
      const trips = destination.trips;
      if (trips) {
        if (trips.length === 1) {
          return res.status(403).json({ errors: [`You can't delete this trip because it is the only trip for a destination`] });
        }
      }
    }
  }

  await DI.em.remove(existingTrips).flush();
  DI.em.clear();
  return res.status(204).send();

});

// GET /trips/{id}/destinations
router.get('/:id/destinations', async (req, res) => {
  const trip = await DI.tripRepository.findOne(
    { id: req.params.id },
    { populate: ['destinations'] }
  );
  if (!trip) {
    return res.status(404).send({ message: 'Trip not found' });
  }

  const destinations = trip.destinations;
  if (!destinations) {
    return res.status(404).send({ message: 'Trip without any Destinations Yet!' });
  }
  return res.status(200).send(destinations.getItems());
});

// POST /trips/{id}/destinations
router.post('/:id/destinations', async (req, res) => {
  try {
    // add destinations to trip
    const trip = await DI.tripRepository.findOne(
      { id: req.params.id },
      { populate: ['destinations'] }
    );
    if (!trip) {
      return res.status(404).send({ message: 'Trip not found' });
    }

    const destinationIds = req.body.destinations;
    const destinations = await DI.destinationRepository.find({
      id: { $in: destinationIds }
    });
    if (destinations.length == 0) {
      return res.status(404).send({ message: 'Destinations not found' });
    }

    if (!trip.destinations) {
      wrap(trip).assign({ destinations }, { em: DI.em });
      await DI.em.flush();
      await DI.tripRepository.populate(trip, ['destinations']);

      return res.status(201).send({ message: 'Destinations added to Trip' });
    }

    const updatedDestinations = trip.destinations?.getItems().concat(destinations);
    wrap(trip).assign({ destinations: updatedDestinations }, { em: DI.em });

    await DI.em.flush();
    await DI.tripRepository.populate(trip, ['destinations']);

    return res.status(201).send(trip);
  }
  catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// DELETE /trips/{id}/destinations
router.delete('/:id/destinations', async (req, res) => {
  const trip = await DI.tripRepository.findOne(
    { id: req.params.id },
    { populate: ['destinations'] }
  );
  if (!trip) {
    return res.status(404).send({ message: 'Trip not found' });
  }

  if (!req.body.destinationIds) {
    wrap(trip).assign({ destinations: [] }, { em: DI.em });
    await DI.em.persistAndFlush(trip);

    return res.status(204).send({ message: 'All Destinations removed from Trip' });
  }

  const destinationIds = req.body.destinationIds;
  const destinations = await DI.destinationRepository.find({
    id: { $in: destinationIds }
  });
  if (!destinations) {
    return res.status(404).send({ message: 'Destinations not found' });
  }

  const updatedDestinations = trip.destinations?.getItems().filter((d) => !destinationIds.includes(d.id));
  wrap(trip).assign({ destinations: updatedDestinations });

  await DI.em.flush();

  return res.status(204).send({ message: 'Destinations removed from Trip' });
});

// DELETE /trips/{tripIid}/destinations/{destinationIds}
router.delete('/:id/destinations/:ids', async (req, res) => {
  const tripId = req.params.id;
  const destinationIds = req.params.ids.split(',');

  const trip = await DI.tripRepository.findOne(tripId, { populate: ['destinations'] });
  const destinations = await DI.destinationRepository.find({ id: { $in: destinationIds }, trips: { id: tripId } });

  if (!trip || destinations.length == 0) {
    return res.status(404).send({ message: 'Trip or Destinations not found' });
  }

  // check if the destinations that gonna be deleted have other trips if not do not update the trip
  for (const dest of destinations) {
    const trips = dest.trips;
    if (trips) {
      if (trips.length === 1) {
        return res.status(403).json({ errors: [`You can't delete this destinations because at least one of them dont have other trips`] });
      }
    }
  }

  const updatedDestinations = trip.destinations?.getItems().filter((d) => !destinationIds.includes(d.id));
  wrap(trip).assign({ destinations: updatedDestinations });
  await DI.em.flush();
  return res.status(204).send();
});

// freestyle endpoint
router.get('/:id/calendar', async (req, res) => {
  //const trip = { id: 1, name: 'Trip to Paris', startDate: [2024, 6, 15], endDate: [2024, 6, 20], description: 'A wonderful trip to Paris.' }
  const trip = await DI.tripRepository.findOne(
    { id: req.params.id },
    { populate: ['destinations'] }
  );
  if (!trip) {
    return res.status(404).send({ message: 'Trip not found' });
  }

  let start: [number, number, number, number, number] = [trip.startDate.getFullYear(), trip.startDate.getMonth() + 1, trip.startDate.getDate(), trip.startDate.getHours(), trip.startDate.getMinutes()];
  let end: [number, number, number, number, number] = [trip.endDate.getFullYear(), trip.endDate.getMonth() + 1, trip.endDate.getDate(), trip.endDate.getHours(), trip.endDate.getMinutes()];

  const event = {
    start: start,
    end: end,
    title: trip.name,
    description: trip.description,
    location: trip.name,
    //status: EventStatus.CONFIRMED,
    //busyStatus: 'BUSY'
  };

  createEvent(event, (error, value) => {
    if (error) {
      return res.status(500).send({ message: 'Error creating calendar event.' });
    }

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename=trip_${trip.name}.ics`);
    res.status(200).send(value);
  });

});

export const TripController = router;