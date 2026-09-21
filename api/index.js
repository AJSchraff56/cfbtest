export default async function handler(req, res) {
  // Enable CORS so outside sites or apps can fetch this data
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "application/json");

  try {
    const response = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=500"
    );

    if (!response.ok) {
      throw new Error(`ESPN API returned status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the response on Vercel's edge network for 60 seconds
    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=30"
    );

    // Return the raw JSON
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch college football data.",
      details: error.message,
    });
  }
}
