import { describe, expect, it, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';

import { DI, initializeServer } from '../src';
import e from 'express';

const mockTrip = {
  name: 'Trip 1',
  description: 'Trip 1 description',
  participants: 'Trip 1 participants',
  startDate: '2024-05-02T17:12:40.567Z',
  endDate: '2024-05-10T17:12:40.567Z',
};
let mockTripId: string;
let mockTripStartDate: string;

let mockDestination: object;
let mockDestinationId: string;
let mockDestinationName: string;


describe('Trips Controller', () => {
  beforeAll(async () => {
    await initializeServer();
    DI.orm.config.set('dbName', 'express-test-db');
    DI.orm.config.getLogger().setDebugMode(false);
    DI.orm.config.set('allowGlobalContext', true);
    await DI.orm.config.getDriver().reconnect();
    await DI.orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await DI.orm.close(true);
    DI.server.close();
  });

  beforeEach(async () => {
    const response = await request(DI.server)
      .post('/trips')
      .send(mockTrip);
    mockTripId = response.body.id;
    mockTripStartDate = response.body.startDate;

    const mockDestination = {
      name: 'Destination 1',
      description: 'Destination 1 description',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-10T17:12:40.567Z',
      trips: [{ id: mockTripId }],
    };

    const postRes = await request(DI.server)
      .post(`/destinations`)
      .send(mockDestination);
    mockDestinationId = postRes.body.id;
    mockDestinationName = postRes.body.name;
  });

  // After each test, clear the database
  afterEach(async () => {
    await request(DI.server)
      .delete('/destinations/' + mockDestinationId);

    await request(DI.server)
      .delete('/trips/' + mockTripId);
  });


  it('can create a new trip', async () => {
    const response = await request(DI.server)
      .post('/trips')
      .send(mockTrip);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(mockTrip.name);
    expect(response.body.startDate).toBe(mockTrip.startDate);
    expect(response.body.endDate).toBe(mockTrip.endDate);
  });

  it('can get a list of trips', async () => {
    const response = await request(DI.server).get('/trips');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('can\'t put a trip by removing the destination with only one trip', async () => {
    const updatedTrip = {
      name: 'Trip 1 updated',
      description: 'Trip 1 description updated',
      participants: 'Trip 1 participants',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-10T17:12:40.567Z',
    };

    const putResponse = await request(DI.server)
      .put(`/trips/${mockTripId}`)
      .send(updatedTrip);

    expect(putResponse.status).toBe(403);
  });

  it('can put a trip', async () => {
    const updatedTrip = {
      name: 'Trip 1 updated',
      description: 'Trip 1 description updated',
      participants: 'Trip 1 participants',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-10T17:12:40.567Z',
      destinations: [{ id: mockDestinationId }],
    };

    const putResponse = await request(DI.server)
      .put(`/trips/${mockTripId}`)
      .send(updatedTrip);

    expect(putResponse.status).toBe(200);
    expect(putResponse.body.id).toBeDefined();
    expect(putResponse.body.name).toBe(updatedTrip.name);
    expect(putResponse.body.description).toBe(updatedTrip.description);
  });

  it('can\'t delete a trip if it is the only trip for a destination', async () => {
    const response = await request(DI.server)
      .delete(`/trips/${mockTripId}`);

    expect(response.status).toBe(403);
  });

  it('can delete a trip if it not the only trip for a destination', async () => {
    const trip = {
      name: 'Trip to delete',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-10T17:12:40.567Z',
    };

    const postResponse = await request(DI.server)
      .post('/trips')
      .send(trip);

    const tripId = postResponse.body.id;

    const response = await request(DI.server)
      .delete(`/trips/${tripId}`);

    expect(response.status).toBe(204);
  });

  it('can get a trip by id', async () => {
    const trip = {
      name: 'Trip to get',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-10T17:12:40.567Z',
    };

    const getResponse = await request(DI.server)
      .post('/trips')
      .send(trip);

    const tripId = getResponse.body.id;

    const tripResponse = await request(DI.server)
      .get(`/trips/${tripId}`);

    expect(tripResponse.status).toBe(200);
    expect(tripResponse.body.id).toBeDefined();
    expect(tripResponse.body.name).toBe(trip.name);
    expect(tripResponse.body.startDate).toBe(trip.startDate);
    expect(tripResponse.body.endDate).toBe(trip.endDate);
  });

  it('can get a trip by name', async () => {
    const trip = {
      name: 'Trip to get by name',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-10T17:12:40.567Z',
    };

    const getResponse = await request(DI.server)
      .post('/trips')
      .send(trip);

    const tripName = getResponse.body.name;

    const tripResponse = await request(DI.server)
      .get(`/trips?name=${tripName}`);

    expect(tripResponse.status).toBe(200);
    expect(tripResponse.body[0].id).toBeDefined();
    expect(tripResponse.body[0].name).toBe(trip.name);
  });

  it('can get a trip by start date', async () => {
    const dateResponse = await request(DI.server)
      .get(`/trips?date=${mockTripStartDate.split('T')[0]}`);

    expect(dateResponse.status).toBe(200);
    expect(dateResponse.body[0].id).toBeDefined();
    expect(dateResponse.body[0].startDate).toBe(mockTrip.startDate);
  });

  it('can get destinations for a trip', async () => {
    const response = await request(DI.server)
      .get(`/trips/${mockTripId}/destinations`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].name).toBe(mockDestinationName);
  });

  it('can add a destination to a trip', async () => {
    const trip = {
      name: 'Trip to add destination to',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-10T17:12:40.567Z',
    };

    const postResponse = await request(DI.server)
      .post('/trips')
      .send(trip);

    const tripId = postResponse.body.id;



    const response = await request(DI.server)
      .post(`/trips/${tripId}/destinations`)
      .send({ destinations: [mockDestinationId] });

    expect(response.status).toBe(201);
    expect(response.body.destinations.length).toBeGreaterThan(0);
    expect(response.body.destinations[0].id).toBe(mockDestinationId);
    expect(response.body.destinations[0].name).toBe(mockDestinationName);
  });

  it('can\'t add a not existing destination to a trip', async () => {
    const response = await request(DI.server)
      .post(`/trips/${mockTripId}/destinations`)
      .send({ destinations: ['123'] });

    expect(response.status).toBe(404);
  });

  it('can\'t add an invalid destination to a trip', async () => {
    const response = await request(DI.server)
      .post(`/trips/${mockTripId}/destinations`)
      .send({ destinations: [123] });

    expect(response.status).toBe(400);
  });

  it('can delete a trip\'s destination if it have more than one trip', async () => {
    const trip = {
      name: 'Trip to delete',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-10T17:12:40.567Z',
      destinations: [{ id: mockDestinationId }],
    };

    const postResponse = await request(DI.server)
      .post('/trips')
      .send(trip);

    const response = await request(DI.server)
      .delete(`/trips/${mockTripId}/destinations/${mockDestinationId}`);

    expect(response.status).toBe(204);
  });

  it('can\'t delete a trip\'s destination if it have one trip', async () => {
    const response = await request(DI.server)
      .delete(`/trips/${mockTripId}/destinations/${mockDestinationId}`);

    expect(response.status).toBe(403);
  });

  it('can get a trip\'s calendar', async () => {
    const response = await request(DI.server)
      .get(`/trips/${mockTripId}/calendar`);

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('text/calendar; charset=utf-8');
    expect(response.header['content-disposition']).toBe(`attachment; filename=trip_${mockTrip.name}.ics`);
  });

  it('can\'t get trip\'s calendar if the trip doesnt exist', async () => {
    const response = await request(DI.server)
      .get(`/trips/123/calendar`);

    expect(response.status).toBe(404);
  });
});
