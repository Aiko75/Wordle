const GetAnimeById = async (id) => {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
    if (res.status === 404) {
      return {
        success: false,
        status: 404,
        data: null,
      };
    }
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (err) {
    console.error(`Error fetching: `, err);
    return {
      success: false,
      data: null,
    };
  }
};

export default GetAnimeById;
