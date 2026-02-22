// oceanTownApi.js
// API utility functions for OceanTown client

const API_BASE_URL = 'https://localhost:7109/api';

/**
 * Fetches data from the specified endpoint.
 * @param {string} endpoint - API endpoint (relative to API_BASE_URL)
 * @param {object} [options] - Fetch options
 * @returns {Promise<any>}
 */
export async function fetchFromApi(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Gets a list of towns.
 * @returns {Promise<Array>}
 */
export function getTowns() {
  return fetchFromApi('/towns');
}

/**
 * Gets details for a specific town.
 * @param {string|number} townId
 * @returns {Promise<object>}
 */
export function getTownDetails(townId) {
  return fetchFromApi(`/towns/${townId}`);
}

/**
 * Creates a new town.
 * @param {object} townData
 * @returns {Promise<object>}
 */
export function createTown(townData) {
  return fetchFromApi('/towns', {
    method: 'POST',
    body: JSON.stringify(townData),
  });
}

/**
 * Updates an existing town.
 * @param {string|number} townId
 * @param {object} townData
 * @returns {Promise<object>}
 */
export function updateTown(townId, townData) {
  return fetchFromApi(`/towns/${townId}`, {
    method: 'PUT',
    body: JSON.stringify(townData),
  });
}

/**
 * Deletes a town.
 * @param {string|number} townId
 * @returns {Promise<void>}
 */
export function deleteTown(townId) {
  return fetchFromApi(`/towns/${townId}`, {
    method: 'DELETE',
  });
}

/**
 * Gets simulation for a project.
 * @param {number} projectId
 * @returns {Promise<object>} Simulation
 */
export function getSimulation(projectId) {
  return fetchFromApi(`/simulation/${projectId}`);
}

/**
 * Gets simulation for a project and user.
 * @param {number} projectId
 * @param {string} username
 * @returns {Promise<object>} Simulation
 */
export function getSimulationForUser(projectId, username) {
  return fetchFromApi(`/simulation/${projectId}/${encodeURIComponent(username)}`);
}

/**
 * Steps simulation for a project and user.
 * @param {number} projectId
 * @param {number} userId
 * @param {object} stepRequest - StepRequest object
 * @returns {Promise<object>} StepResponse
 */
export function stepSimulation(projectId, userId, stepRequest) {
  return fetchFromApi(`/simulation/${projectId}/step/${userId}`, {
    method: 'POST',
    body: JSON.stringify(stepRequest),
  });
}