import { describe, expect, it, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';

import { DI, initializeServer } from '../src';

const mockTrip = {
  name: 'Trip 1',
  description: 'Trip 1 description',
  participants: 'Trip 1 participants',
  startDate: '2024-05-02',
  endDate: '2024-05-10',
};
let mockTripId: string;
let mockTripStartDate: string;

let mockDestination: object;
let mockDestinationId: string;
let mockDestinationName: string;


describe('Destinations Controller', () => {
  beforeAll(async () => {
    await initializeServer();
    DI.orm.config.set('dbName', 'express-test-db');
    //DI.orm.config.getLogger().setDebugMode(false);
    DI.orm.config.set('allowGlobalContext', true);
    await DI.orm.config.getDriver().reconnect();
    await DI.orm.getSchemaGenerator().refreshDatabase();


    // Create a mock trip and destination
    const response = await request(DI.server)
      .post('/trips')
      .send(mockTrip);
    mockTripId = response.body.id;
    mockTripStartDate = response.body.startDate;

    mockDestination = {
      name: 'Darmstadt',
      description: 'Destination test description',
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

  afterAll(async () => {
    // Delete the mock trip and destination
    await request(DI.server)
      .delete('/destinations/' + mockDestinationId);

    await request(DI.server)
      .delete('/trips/' + mockTripId);

    await DI.orm.close(true);
    DI.server.close();
  });

  it('can create a new destination', async () => {
    const destination = {
      name: 'Destination 1',
      description: 'Destination 1 description',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-07T17:12:40.567Z',
      trips: [{ id: mockTripId }],
    };

    const response = await request(DI.server)
      .post('/destinations')
      .send(destination);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(destination.name);
    expect(response.body.startDate).toBe(destination.startDate);
    expect(response.body.endDate).toBe(destination.endDate);
  });

  it('can\'t create a destination without at least one trip', async () => {
    const destination = {
      name: 'Destination 1',
      description: 'Destination 1 description',
    };

    const response = await request(DI.server)
      .post('/destinations')
      .send(destination);

    expect(response.status).toBe(400);
  });

  it('can\'t create a destination without name, description or date', async () => {
    const destination = {
      name: 'Destination 1',
      description: 'Destination 1 description',
      trips: [{ id: mockTripId }],
    };

    const response = await request(DI.server)
      .post('/destinations')
      .send(destination);

    expect(response.status).toBe(400);
  });

  it('can get a list of destinations', async () => {
    const response = await request(DI.server).get('/destinations');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('can put a destination', async () => {
    const updatedDestination = {
      name: 'Berlin',
      description: 'Destination 1 description updated',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-09T17:12:40.567Z',
      trips: [{ id: mockTripId }],
    };

    mockDestinationName = updatedDestination.name;

    const response = await request(DI.server)
      .put('/destinations/' + mockDestinationId)
      .send(updatedDestination);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedDestination.name);
    expect(response.body.description).toBe(updatedDestination.description);
    expect(response.body.startDate).toBe(updatedDestination.startDate);
    expect(response.body.endDate).toBe(updatedDestination.endDate);
  });

  it('can\'t put a destination if it doesnt exist', async () => {
    const updatedDestination = {
      name: 'Berlin',
      description: 'Destination 1 description updated',
      startDate: '2024-05-02T17:12:40.567Z',
      endDate: '2024-05-09T17:12:40.567Z',
      trips: [{ id: mockTripId }],
    };

    mockDestinationName = updatedDestination.name;

    const response = await request(DI.server)
      .put('/destinations/123')
      .send(updatedDestination);

    expect(response.status).toBe(404);
  });

  it('can\'t put a destination without without name, description or date', async () => {
    const updatedDestination = {
      description: 'wihtout required fields wont work',
      trips: [{ id: mockTripId }],
    };

    const response = await request(DI.server)
      .put('/destinations/' + mockDestinationId)
      .send(updatedDestination);

    expect(response.status).toBe(400);
  });

  it('can get a destination by id', async () => {
    const response = await request(DI.server).get('/destinations/' + mockDestinationId);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(mockDestinationId);
    expect(response.body.name).toBe(mockDestinationName);
  });

  it('can get a list of trips for a destination', async () => {
    const response = await request(DI.server).get('/destinations/' + mockDestinationId + '/trips');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('can delete a destination', async () => {
    const response = await request(DI.server).delete('/destinations/' + mockDestinationId);
    const getResponse = await request(DI.server).get('/destinations/' + mockDestinationId);

    expect(response.status).toBe(204);
    expect(getResponse.status).toBe(404);
  });

  it('can\'t delete a destination if it doesnt exist', async () => {
    const response = await request(DI.server).delete('/destinations/123');

    expect(response.status).toBe(404);
  });

  it('returns 404 if destination not found', async () => {
    const response = await request(DI.server).get('/destinations/123');

    expect(response.status).toBe(404);
  });
});
