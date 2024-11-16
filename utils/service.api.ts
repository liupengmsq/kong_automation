import axios from 'axios';

const baseUrl = 'http://localhost:8001/default/services';

/**
 * Get all service IDs
 * @returns Promise<string[]> List of service id
 */
async function getAllServiceIds(): Promise<string[]> {
  try {
    const response = await axios.get(baseUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    const services = response.data.data;
    const ids = services.map((service: { id: string }) => service.id);
    return ids;
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching service IDs:', err.message);
    return [];
  }
}

/**
 * Delete service by id
 * @param id service id to delete
 */
async function deleteServiceById(id: string): Promise<void> {
  try {
    const deleteUrl = `${baseUrl}/${id}`;
    await axios.delete(deleteUrl, {
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    });
    console.log(`Service with ID ${id} deleted successfully.`);
  } catch (error) {
    const err = error as Error;
    console.error(`Error deleting service with ID ${id}:`, err.message);
    throw error;
  }
}

/**
 * Delete all gateway services
 */
export async function deleteAllServicesConcurrently(): Promise<void> {
  const ids = await getAllServiceIds();
  if (ids.length === 0) {
    console.log('No services found.');
    return;
  }

  console.log(`Found ${ids.length} services. Deleting concurrently...`);
  await Promise.all(ids.map(deleteServiceById));
  console.log('All services deleted.');
}
