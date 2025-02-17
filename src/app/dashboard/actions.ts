'use server';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function fetchDashboardOverview() {
  try {
    const res = await fetch(`${BASE_PATH}/api/dashboard/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      const errorData = await res.json(); // Parse error response
      throw new Error(
        JSON.stringify({ status: errorData.status, message: errorData.message })
      );
    }

    return await res.json();
  } catch (error: any) {
    return {
      error: error?.message || 'Failed to fetch dashboard overview',
      status: 500,
    };
  }
}
