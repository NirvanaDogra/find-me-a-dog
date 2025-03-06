
export async function fetchDogs(from: number, breeds: Array<string>, sortOrder: string): Promise<any> {
  let url = `https://frontend-take-home-service.fetch.com/dogs/search?from=${from}&size=24&sort=breed:${sortOrder}`;
  if (breeds && breeds.length > 0) {
    url += breeds.map(breed => `&breeds[]=${encodeURIComponent(breed)}`).join('');
  }
  const options: RequestInit = {
    method: "GET",
    credentials: "include"
  };

  const response: Response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

export async function fetchBreeds(): Promise<any> {
  const url = `https://frontend-take-home-service.fetch.com/dogs/breeds`;
  const options: RequestInit = {
    method: "GET",
    credentials: "include"
  };

  const response: Response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

export async function fetchDogDetails(dogIds: Array<string>): Promise<any> {
  const url = `https://frontend-take-home-service.fetch.com/dogs`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dogIds),
    credentials: "include",
  };

  const response: Response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

export async function matchDogs(dogIds: Array<string>): Promise<{ match: string }> {
  const url = `https://frontend-take-home-service.fetch.com/dogs/match`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dogIds),
    credentials: "include",
  };

  const response: Response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}