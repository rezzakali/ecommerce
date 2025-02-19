'use server';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const getProduct = async ({ slug }: { slug: string }) => {
  const res = await fetch(`${BASE_PATH}/api/products/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json(); // Parse error response
    throw new Error(
      JSON.stringify({ status: errorData.status, message: errorData.message })
    );
  }

  return await res.json(); // Return the successful response data
};
