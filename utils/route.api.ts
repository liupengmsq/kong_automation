import axios from 'axios';

const baseUrl = 'http://localhost:8001/default/routes';

/**
 * Get all route IDs
 * @returns Promise<string[]> List of route id
 */
async function getAllRouteIds(): Promise<string[]> {
  try {
    const response = await axios.get(baseUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    const routes = response.data.data;
    const ids = routes.map((route: { id: string }) => route.id);
    return ids;
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching route IDs:', err.message);
    return [];
  }
}

/**
 * Delete route by id
 * @param id route id to delete
 */
async function deleteRouteById(id: string): Promise<void> {
  try {
    const deleteUrl = `${baseUrl}/${id}`;
    await axios.delete(deleteUrl, {
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    });
    console.log(`Route with ID ${id} deleted successfully.`);
  } catch (error) {
    const err = error as Error;
    console.error(`Error deleting route with ID ${id}:`, err.message);
    throw error;
  }
}

/**
 * Delete all routes
 */
export async function deleteAllRoutesConcurrently(): Promise<void> {
  const ids = await getAllRouteIds();
  if (ids.length === 0) {
    console.log('No route found.');
    return;
  }

  console.log(`Found ${ids.length} routes. Deleting concurrently...`);
  await Promise.all(ids.map(deleteRouteById));
  console.log('All routes deleted.');
}
