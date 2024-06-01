import { Router } from 'express';

import { wrap } from '@mikro-orm/core';

import { DI } from '..';
import { CreateDestinationDTO, CreateTripDTODestination, CreateDestinationSchema, Destination } from '../entities';
import { getCountryData } from '../services/countries.service';
import { getWeatherData } from '../services/weather.service';


const router = Router({ mergeParams: true });

// GET /destinations
router.get('/', async (req, res) => {
  const { name } = req.query;
  let query: any = {};
  if (name) {
    query.name = { $ilike: `%${name}%` }; // Case-insensitive search for name
  }

  try {
    const destinations = await DI.destinationRepository.find(query, { populate: ['trips'] });
    return res.status(200).send(destinations);
  } catch (error) {
    return res.status(500).send({ error: 'An error occurred while fetching destinations.' });
  }
});

// POST /destinations
router.post('/', async (req, res) => {
  const validatedData = await CreateDestinationSchema.validate(req.body).catch((e) => {
    res.status(400).json({ errors: e.errors });
  });
  if (!validatedData) {
    return;
  }
  const createDestinationDTO: CreateDestinationDTO = {
    ...validatedData,
  };
  const destination = new Destination(createDestinationDTO);

  const tripsIds: string[] = [];
  // new trips with object
  const newTrips: CreateTripDTODestination[] = [];
  if (createDestinationDTO.trips) {
    for (const curTrip of createDestinationDTO.trips) {
      if (curTrip.id) {
        tripsIds.push(curTrip.id);
      }
      // TODO else if(){}

    }

    const loadedTrips = await DI.tripRepository.find({ id: { $in: tripsIds } });
    const mergedTrips = [...loadedTrips, ...newTrips];

    wrap(destination).assign({ trips: mergedTrips }, { em: DI.em });

    await DI.em.persistAndFlush(destination);
    await DI.destinationRepository.populate(destination, ['trips']);


  }
  else {
    await DI.em.persistAndFlush(destination);
  }

  res.status(201).send(destination);
});

// GET /destinations/{id}
router.get('/:id', async (req, res) => {
  const destination = await DI.destinationRepository.findOne(
    { id: req.params.id },
    { populate: ['trips'] }
  );
  if (!destination) {
    return res.status(404).send('Destination not found');
  }
  try {
    // country Code = first 2 letters of the destination name
    const weatherData = await getWeatherData(destination.name);
    const countryCode = weatherData.sys.country;
    const countryData = await getCountryData(countryCode);
    const result = {
      ...destination,
      country: countryData,
      weather: weatherData,
    };
    console.log(result);

    res.status(200).send(result);
  } catch (error) {
    return res.status(200).send(destination);
  };
});

// PUT /destinations/{id}
router.put('/:id', async (req, res) => {
  try {
    const destination = await DI.destinationRepository.findOne(req.params.id, {
      populate: ['trips']
    });

    if (!destination) {
      return res.status(404).send('Destination not found');
    }

    const validatedData = await CreateDestinationSchema.validate(req.body).catch((e) => {
      res.status(400).json({ errors: e.errors });
    });
    if (!validatedData) {
      return;
    }

    if (req.body.id) {
      delete req.body.id;
    }

    wrap(destination).assign(req.body);
    await DI.em.flush();

    res.status(200).json(destination);
  } catch (e: any) {
    return res.status(400).send({ message: [e.message] });
  }
});

// DELETE /destinations/{id}
router.delete('/:id', async (req, res) => {
  const existingsDestinations = await DI.destinationRepository.find({
    id: req.params.id,
  });
  if (existingsDestinations.length === 0) {
    return res.status(404).json({ errors: [`You can't delete this id`] });
  }
  await DI.em.remove(existingsDestinations).flush();
  DI.em.clear();
  return res.status(204).send({});
});

// GET /destinations/{id}/trips
router.get('/:id/trips', async (req, res) => {
  const destination = await DI.destinationRepository.findOne(
    { id: req.params.id },
    { populate: ['trips'] }
  );
  if (!destination) {
    return res.status(404).send({ message: 'Destination not found' });
  }

  const trips = destination.trips;
  if (!trips) {
    return res.status(404).send({ message: 'Destination without Trips Yet! SYSTEM ERROR!' });
  }
  res.status(200).send(trips.getItems());
});

export const DestinationController = router;