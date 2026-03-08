import { NextResponse } from "next/server";

interface AstronomyEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
}

/**
 * Generates well-known recurring astronomical events for a given year.
 * Includes meteor showers, equinoxes, solstices, and eclipses.
 */
function getAstronomicalEvents(year: number): AstronomyEvent[] {
  const events: AstronomyEvent[] = [];

  // --- Meteor Showers (approximate annual peak dates) ---
  const meteorShowers: { name: string; month: number; day: number; description: string }[] = [
    { name: "Quadrantids Meteor Shower", month: 1, day: 4, description: "One of the best annual meteor showers, producing up to 120 multicolored meteors per hour at its peak." },
    { name: "Lyrids Meteor Shower", month: 4, day: 22, description: "An average shower producing about 20 meteors per hour at its peak, known for bright dust trails." },
    { name: "Eta Aquarids Meteor Shower", month: 5, day: 6, description: "An above-average shower from Halley's Comet debris, producing up to 60 meteors per hour." },
    { name: "Delta Aquarids Meteor Shower", month: 7, day: 29, description: "An average shower producing up to 20 meteors per hour, best viewed from southern latitudes." },
    { name: "Perseids Meteor Shower", month: 8, day: 12, description: "One of the best meteor showers, producing up to 100 bright meteors per hour at its peak." },
    { name: "Draconids Meteor Shower", month: 10, day: 8, description: "A minor meteor shower producing about 10 meteors per hour, best viewed in the early evening." },
    { name: "Orionids Meteor Shower", month: 10, day: 21, description: "An average shower producing up to 25 meteors per hour from Halley's Comet debris." },
    { name: "Leonids Meteor Shower", month: 11, day: 17, description: "A shower producing up to 15 meteors per hour, known for periodic meteor storms roughly every 33 years." },
    { name: "Geminids Meteor Shower", month: 12, day: 14, description: "The king of meteor showers, producing up to 150 multicolored meteors per hour at its peak." },
    { name: "Ursids Meteor Shower", month: 12, day: 22, description: "A minor meteor shower producing about 5–10 meteors per hour, associated with Comet Tuttle." },
  ];

  for (const shower of meteorShowers) {
    events.push({
      id: `meteor-${shower.name.toLowerCase().replace(/\s+/g, "-")}-${year}`,
      title: shower.name,
      description: shower.description,
      event_date: new Date(year, shower.month - 1, shower.day, 0, 0, 0).toISOString(),
    });
  }

  // --- Equinoxes & Solstices ---
  const seasons: { name: string; month: number; day: number; description: string }[] = [
    { name: "Vernal Equinox", month: 3, day: 20, description: "The Sun crosses the celestial equator heading north, marking the start of spring in the Northern Hemisphere." },
    { name: "Summer Solstice", month: 6, day: 21, description: "The longest day of the year in the Northern Hemisphere, when the Sun reaches its highest point in the sky." },
    { name: "Autumnal Equinox", month: 9, day: 22, description: "The Sun crosses the celestial equator heading south, marking the start of autumn in the Northern Hemisphere." },
    { name: "Winter Solstice", month: 12, day: 21, description: "The shortest day of the year in the Northern Hemisphere, marking the start of astronomical winter." },
  ];

  for (const season of seasons) {
    events.push({
      id: `season-${season.name.toLowerCase().replace(/\s+/g, "-")}-${year}`,
      title: season.name,
      description: season.description,
      event_date: new Date(year, season.month - 1, season.day, 0, 0, 0).toISOString(),
    });
  }

  // --- Year-Specific Eclipses ---
  const eclipsesByYear: Record<number, { name: string; month: number; day: number; description: string }[]> = {
    2025: [
      { name: "Total Lunar Eclipse", month: 3, day: 14, description: "A total lunar eclipse visible from the Americas, Europe, and Africa. The Moon passes fully into Earth's shadow." },
      { name: "Partial Solar Eclipse", month: 3, day: 29, description: "A partial solar eclipse visible from parts of Europe, northern Africa, and western Russia." },
      { name: "Total Lunar Eclipse", month: 9, day: 7, description: "A total lunar eclipse visible from Europe, Africa, Asia, and Australia." },
      { name: "Partial Solar Eclipse", month: 9, day: 21, description: "A partial solar eclipse visible from the South Pacific, New Zealand, and Antarctica." },
    ],
    2026: [
      { name: "Annular Solar Eclipse", month: 2, day: 17, description: "An annular solar eclipse visible from Antarctica and the southern tip of South America." },
      { name: "Total Lunar Eclipse", month: 3, day: 3, description: "A total lunar eclipse visible from eastern Asia, Australia, the Pacific, and western North America." },
      { name: "Total Solar Eclipse", month: 8, day: 12, description: "A total solar eclipse visible from the Arctic, Greenland, Iceland, and northern Spain." },
      { name: "Partial Lunar Eclipse", month: 8, day: 28, description: "A partial lunar eclipse visible from the Americas, Europe, Africa, and western Asia." },
    ],
    2027: [
      { name: "Penumbral Lunar Eclipse", month: 2, day: 20, description: "A penumbral lunar eclipse visible from the Americas, Europe, and Africa." },
      { name: "Total Solar Eclipse", month: 8, day: 2, description: "A total solar eclipse visible from North Africa, the Middle East, and southern Asia." },
      { name: "Penumbral Lunar Eclipse", month: 8, day: 17, description: "A penumbral lunar eclipse visible from eastern Asia, Australia, and the Pacific." },
    ],
  };

  const eclipses = eclipsesByYear[year];
  if (eclipses) {
    eclipses.forEach((eclipse, idx) => {
      events.push({
        id: `eclipse-${year}-${eclipse.month}-${eclipse.day}-${idx}`,
        title: eclipse.name,
        description: eclipse.description,
        event_date: new Date(year, eclipse.month - 1, eclipse.day, 0, 0, 0).toISOString(),
      });
    });
  }

  return events;
}

export async function GET() {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Generate events for current year and next year
    const allEvents = [
      ...getAstronomicalEvents(currentYear),
      ...getAstronomicalEvents(currentYear + 1),
    ];

    // Filter to upcoming events only and sort by date
    const upcomingEvents = allEvents
      .filter((e) => new Date(e.event_date) >= now)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    return NextResponse.json({ events: upcomingEvents });
  } catch (err) {
    console.error("[astronomy-events] Error generating events:", err);
    return NextResponse.json(
      { events: [], error: "Failed to generate astronomical events" },
      { status: 500 }
    );
  }
}
