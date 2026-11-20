# unical – Functions for calendar conversion

A TypeScript library for converting between different calendars. The API works by converting dates to/from [Julian day numbers](https://en.wikipedia.org/wiki/Julian_day) as an intermediate format.

## Supported Calendars

- `"gregorian"` — [Gregorian](https://en.wikipedia.org/wiki/Gregorian_calendar) (proleptic)
- `"julian"` — [Julian](https://en.wikipedia.org/wiki/Julian_calendar) (proleptic)
- `"hebrew"` — [Hebrew](https://en.wikipedia.org/wiki/Hebrew_calendar)
- `"islamic"` — [Islamic (tabular Hijri)](https://en.wikipedia.org/wiki/Islamic_calendar)
- `"persian"` — [Persian (astronomical Solar Hijri)](https://en.wikipedia.org/wiki/Solar_Hijri_calendar)

## Usage

Convert a date in any supported calendar to its Julian day number with `toJD()`, then convert that Julian day to a date in any other calendar with `fromJD()`.

```ts
import { fromJD, toJD } from "unical";

// Convert Islamic date, e.g., 14 Jumada al-Akhira 505
const jd = toJD("islamic", 505, 6, 14);

// Convert Julian day to Julian calendar date
const [year, month, day] = fromJD("julian", jd);
console.log(`${year}-${month}-${day}`); // 1111-12-18
```

### Conventions and Validation

- **Julian days:** `toJD()` returns a midnight Julian date ending in `.5` (00:00 UTC) for dates within normal ranges. `fromJD()` and `weekday()` accept fractional Julian days and roll over dates consistently at midnight (`N + 0.5`). As a safety cap, Julian days with `|jd| >= 2^52` are rejected.
- **Practical ranges:** Conversions are intended and tested for historical and modern dates (the `2^52` limit is for code safety, not to guarantee accuracy). In particular, the `"persian"` astronomical equinox approximation is valid for Gregorian years `-1000` through `3000` (Persian `-1622` through `2379`); extreme years or Julian days well outside normal ranges may lose floating-point or astronomical accuracy.
- **Year numbering:** All five calendars use continuous astronomical year numbering, including year `0` (for example, `0` is 1 BCE and `-1` is 2 BCE in both the Gregorian and Julian calendars).
- **Hebrew months:** Months are numbered `1` (Nisan) through `6` (Elul), then `7` (Tishri, the start of the Hebrew civil year) through `12` (Adar / Adar I), and `13` (Adar II) in leap years.
- **Strict input validation:** `toJD()`, `fromJD()`, `isLeapYear()`, `yearMonths()`, `yearDays()`, `monthDays()`, and `weekday()` throw a `RangeError` on invalid inputs (unsupported calendar, non-safe-integer date components, nonexistent months, overflowing days, or non-finite / out-of-precision Julian days). Use `isCalendar()` and `isValidDate()` to validate untrusted inputs without throwing.

### API Reference

**Types and constants:**

- `CALENDARS`: read-only array of supported calendar identifiers (`["gregorian", "julian", "hebrew", "islamic", "persian"]`)
- `Calendar`: union type of supported calendar identifiers (`(typeof CALENDARS)[number]`)
- `CalendarDate`: `[year: number, month: number, day: number]`
- `WEEKDAYS`, `ISLAMIC_WEEKDAYS`, `PERSIAN_WEEKDAYS`: read-only weekday name arrays indexed `0` (Sunday) through `6` (Saturday)

**Functions:**

- `toJD(calendar, year, month, day)` → `number`: convert a valid calendar date to its midnight Julian day
- `fromJD(calendar, jd)` → `CalendarDate`: convert a Julian day to `[year, month, day]` in the specified calendar
- `isCalendar(value)` → `value is Calendar`: type guard returning whether `value` is a supported calendar identifier (_never throws_)
- `isValidDate(calendar, year, month, day)` → `boolean`: return whether the date is valid (_never throws_)
- `isLeapYear(calendar, year)` → `boolean`: return whether the given year is a leap year
- `yearMonths(calendar, year)` → `number`: return the number of months in the year (`12`, or `13` for Hebrew leap years)
- `yearDays(calendar, year)` → `number`: return the number of days in the year
- `monthDays(calendar, year, month)` → `number`: return the number of days in the given month
- `weekday(jd)` → `number`: return the day of the week (`0` = Sunday .. `6` = Saturday)

For actual usage examples, see the [muqawwim.com](https://www.muqawwim.com/) calendar conversion web app ([GitHub repo](https://github.com/theodore-s-beers/muqawwim)).

## Background

`unical` is a modernized TypeScript fork of the JavaScript code underlying the [Fourmilab calendar converter](https://www.fourmilab.ch/documents/calendar/) by [John Walker](https://en.wikipedia.org/wiki/John_Walker_%28programmer%29). The original license, dated 1999, remains in the source code. This fork includes numerous adjustments, simplifications, and modernizations accumulated over several years, along with TypeScript type safety and test coverage.
