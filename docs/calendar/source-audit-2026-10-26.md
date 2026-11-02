# Calendar source audit — 2026-10-26

Research notes for [Priority 1](../roadmap.md). These are **candidate data sources**, not partner participation or permission to syndicate.

| Organization | Public source checked | Feed status | Next action |
| --- | --- | --- | --- |
| PfISD | https://www.pfisd.net/about-us/calendar | Official site documents iCalendar subscriptions, but exact ICS URL and calendar category have not been validated | Use calendar's RSS/feeds menu to retrieve actual URL; test event scope, recurrence and cancellations |
| Wieland Elementary | https://wles.pfisd.net/services/library/calendar | Public page currently says no events | Talk to PTO about an approved independent public-event submission workflow |
| Wieland PTO | PTO Facebook page, linked separately by project owner | Facebook is not a reliable public API/ICS source | Obtain authorization/contact; manually enter event after approval; never rely on private FB data |
| Ruth Barron PTO | Separate PTO involvement reported by project owner | Public URL/feed not yet validated | Find the organization's canonical event page and confirm who may publish |
| Brookfield Owners Association | https://www.brookfieldowners.com/events/list/ | Public WordPress calendar shows zero upcoming events. TownSq community news is behind login | Test WordPress calendar iCal endpoint with actual events; use approved manual submissions meanwhile |
| Northtown MUD | https://northtownmud.org/ ; https://northtownmud.org/agendas-and-packets/ | Official public meeting and notice pages; no verified ICS feed | Ask whether a public ICS or notices feed exists; categorize public meeting notices separately |

## Follow-up validation checklist

- [ ] Obtain actual public ICS URL, response content type and a redacted sample with identifiable current public event.
- [ ] Confirm that an event cancellation, date change and recurrence exception propagate.
- [ ] Ensure calendar is not a private authenticated feed (even if a token URL happens to work).
- [ ] Compare 90 days of displayed events against each source's own public page.
- [ ] Record contact/authorization without committing personal contact details.
- [ ] Confirm whether co-host language and logos can be displayed.
- [ ] Introduce a genuine second organization before treating the calendar as an operational coalition service.

## OSS choice (provisional)

- [Community Calendar](https://github.com/judell/community-calendar): Apache-2.0. Mature ideas/features for curated ingestion, health reporting, dedupe and event capture. Full deployment uses Python, Supabase and XMLUI; not adopted wholesale for the very first slice.
- [node-ical](https://github.com/jens-maus/node-ical): Apache-2.0, version 0.27.3 at research time. Chosen as a dependency for a lightweight JS calendar importer; tests must cover DST/recurrences.
- Facebook event publishing: **unverified and deferred**. Do not advertise this as working.

## Security and governance

The first published calendar should be read-only to visitors and never scrape resident-only TownSq or private group feeds. Each approved event should link to its real source, and a partner's public participation should be opt-in. There is no school/HOA legal partnership created by software entries.
