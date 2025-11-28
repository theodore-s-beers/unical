# unical – Functions for calendar conversion

A TypeScript library for converting between different calendars. The API works by converting dates to/from [Julian day numbers](https://en.wikipedia.org/wiki/Julian_day) as an intermediate format.

## Supported Calendars

- [Gregorian](https://en.wikipedia.org/wiki/Gregorian_calendar)
- [Julian](https://en.wikipedia.org/wiki/Julian_calendar)
- [Hebrew](https://en.wikipedia.org/wiki/Hebrew_calendar)
- [Islamic (Hijri)](https://en.wikipedia.org/wiki/Islamic_calendar)
- [Persian (Solar Hijri)](https://en.wikipedia.org/wiki/Solar_Hijri_calendar)

## Usage

Convert a date in any supported calendar to its Julian day number, then convert that Julian day to a date in any other calendar.

```ts
import { islamicToJD, jdToJulian } from "unical";

// Convert Islamic date, e.g. 14 Jumada al-Akhira 505
const jd = islamicToJD(505, 6, 14);

// Convert Julian day to proper Julian date
const [year, month, day] = jdToJulian(jd);
console.log(`${year}-${month}-${day}`); // 1111-12-18
```

### Available Functions

**Conversion to Julian day:**

- `gregorianToJD(year, month, day)`
- `julianToJD(year, month, day)`
- `hebrewToJD(year, month, day)`
- `islamicToJD(year, month, day)`
- `persianAToJD(year, month, day)`

**Conversion from Julian day:**

- `jdToGregorian(jd)` → `[year, month, day]`
- `jdToJulian(jd)` → `[year, month, day]`
- `jdToHebrew(jd)` → `[year, month, day]`
- `jdToIslamic(jd)` → `[year, month, day]`
- `jdToPersianA(jd)` → `[year, month, day]`

**Utilities:**

- `leapGregorian(year)`, `leapJulian(year)`, `leapIslamic(year)`, `leapPersianA(year)`, `hebrewLeap(year)`: check if a given year is a leap year in the specified calendar
- `hebrewYearDays(year)`: get the number of days in a given Hebrew year
- `jWeekday(jd)`: get day of week from Julian day
- `WEEKDAYS`, `ISLAMIC_WEEKDAYS`, `PERSIAN_WEEKDAYS`: weekday name constants

For actual usage examples, see the [muqawwim.com](https://www.muqawwim.com/) calendar conversion web app ([GitHub repo](https://github.com/theodore-s-beers/muqawwim)).

## Background

`unical` is a modernized TypeScript fork of the JavaScript code underlying the [Fourmilab calendar converter](https://www.fourmilab.ch/documents/calendar/) by [John Walker](https://en.wikipedia.org/wiki/John_Walker_%28programmer%29). The original license, dated 1999, remains in the source code. This fork includes numerous adjustments, simplifications, and modernizations accumulated over several years, along with TypeScript type safety and test coverage.
