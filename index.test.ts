import { deepStrictEqual, throws } from "node:assert";
import { test } from "node:test";

import {
  CALENDARS,
  type Calendar,
  type CalendarDate,
  fromJD,
  isCalendar,
  isLeapYear,
  isValidDate,
  monthDays,
  toJD,
  weekday,
  yearDays,
  yearMonths,
} from "./index.ts";

test("leap years match year-start differences and yearDays across all calendars", () => {
  for (const calendar of CALENDARS) {
    const startMonth = calendar === "hebrew" ? 7 : 1;

    for (let year = -60; year <= 60; year++) {
      const lengthFromJD =
        toJD(calendar, year + 1, startMonth, 1) - toJD(calendar, year, startMonth, 1);
      deepStrictEqual(yearDays(calendar, year), lengthFromJD);

      let sumOfMonths = 0;
      const months = yearMonths(calendar, year);
      for (let month = 1; month <= months; month++) {
        sumOfMonths += monthDays(calendar, year, month);
      }
      deepStrictEqual(sumOfMonths, lengthFromJD);

      const expectedLeap =
        calendar === "hebrew"
          ? months === 13
          : calendar === "islamic"
            ? lengthFromJD === 355
            : lengthFromJD === 366;
      deepStrictEqual(isLeapYear(calendar, year), expectedLeap);
    }
  }
});

test("gregorian and julian century leap year rules", () => {
  deepStrictEqual(isLeapYear("gregorian", 1900), false);
  deepStrictEqual(isLeapYear("gregorian", 2000), true);
  deepStrictEqual(isLeapYear("gregorian", 2020), true);
  deepStrictEqual(isLeapYear("gregorian", 0), true);

  deepStrictEqual(isLeapYear("julian", 1900), true);
  deepStrictEqual(isLeapYear("julian", 2000), true);
  deepStrictEqual(isLeapYear("julian", 0), true);
  deepStrictEqual(isLeapYear("julian", -1), false);
  deepStrictEqual(isLeapYear("julian", -4), true);
});

test("year-zero transitions and negative years are continuous in all calendars", () => {
  for (const calendar of CALENDARS) {
    const firstMonth = calendar === "hebrew" ? 7 : 1;
    const lastMonthOf = (year: number) => (calendar === "hebrew" ? 6 : yearMonths(calendar, year));

    const prevEnd: CalendarDate = [-1, lastMonthOf(-1), monthDays(calendar, -1, lastMonthOf(-1))];
    const zeroStart: CalendarDate = [0, firstMonth, 1];
    const zeroEnd: CalendarDate = [0, lastMonthOf(0), monthDays(calendar, 0, lastMonthOf(0))];
    const oneStart: CalendarDate = [1, firstMonth, 1];

    for (const date of [prevEnd, zeroStart, zeroEnd, oneStart]) {
      const jd = toJD(calendar, ...date);
      deepStrictEqual(((jd % 1) + 1) % 1, 0.5);
      deepStrictEqual(fromJD(calendar, jd), date);
    }

    deepStrictEqual(toJD(calendar, ...zeroStart) - toJD(calendar, ...prevEnd), 1);
    deepStrictEqual(toJD(calendar, ...oneStart) - toJD(calendar, ...zeroEnd), 1);
  }
});

test("julian astronomical year zero aligns with gregorian and JD epoch", () => {
  deepStrictEqual(toJD("julian", -4712, 1, 1), -0.5);
  deepStrictEqual(fromJD("julian", -0.5), [-4712, 1, 1]);
  deepStrictEqual(toJD("julian", 0, 1, 3), toJD("gregorian", 0, 1, 1));
  deepStrictEqual(toJD("julian", 1, 1, 1), toJD("gregorian", 0, 12, 30));
});

test("hebrew leap years, year lengths, and month boundaries", () => {
  deepStrictEqual(isLeapYear("hebrew", 4321), true);
  deepStrictEqual(isLeapYear("hebrew", 5784), true);
  deepStrictEqual(isLeapYear("hebrew", 5785), false);

  deepStrictEqual(yearMonths("hebrew", 5784), 13);
  deepStrictEqual(yearMonths("hebrew", 5785), 12);

  deepStrictEqual(yearDays("hebrew", 5783), 355); // common complete
  deepStrictEqual(yearDays("hebrew", 5784), 383); // leap deficient
  deepStrictEqual(yearDays("hebrew", 5785), 355); // common complete
  deepStrictEqual(yearDays("hebrew", 5786), 354); // common regular
  deepStrictEqual(yearDays("hebrew", 5787), 385); // leap complete

  deepStrictEqual(monthDays("hebrew", 5784, 12), 30); // Adar I
  deepStrictEqual(monthDays("hebrew", 5784, 13), 29); // Adar II
  deepStrictEqual(monthDays("hebrew", 5785, 12), 29); // Adar (common)

  deepStrictEqual(fromJD("hebrew", toJD("gregorian", 2023, 9, 15)), [5783, 6, 29]);
  deepStrictEqual(fromJD("hebrew", toJD("gregorian", 2023, 9, 16)), [5784, 7, 1]);
  deepStrictEqual(fromJD("hebrew", toJD("gregorian", 2024, 4, 8)), [5784, 13, 29]);
  deepStrictEqual(fromJD("hebrew", toJD("gregorian", 2024, 4, 9)), [5784, 1, 1]);
});

test("hebrew dates round trip", () => {
  const dates: CalendarDate[] = [
    [-100, 7, 1],
    [0, 7, 1],
    [1, 7, 1],
    [5783, 12, 29],
    [5784, 7, 1],
    [5784, 12, 30],
    [5784, 13, 1],
    [5784, 1, 1],
    [5784, 6, 29],
  ];

  for (const date of dates) {
    deepStrictEqual(fromJD("hebrew", toJD("hebrew", ...date)), date);
  }
});

test("islamic dates and leap-month boundaries round trip", () => {
  deepStrictEqual(monthDays("islamic", 1445, 12), 30);
  deepStrictEqual(monthDays("islamic", 1446, 12), 29);
  deepStrictEqual(monthDays("islamic", 1446, 2), 29);
  deepStrictEqual(monthDays("islamic", 1446, 3), 30);

  const dates: CalendarDate[] = [
    [-2, 12, 29],
    [-1, 12, 30],
    [0, 12, 29],
    [1, 1, 1],
    [2, 12, 30],
    [957, 5, 26],
    [1445, 12, 30],
    [1446, 2, 29],
    [1446, 3, 30],
  ];

  for (const date of dates) {
    deepStrictEqual(fromJD("islamic", toJD("islamic", ...date)), date);
  }
});

test("persian new year boundaries, leap years, and midnight JDs", () => {
  deepStrictEqual(isLeapYear("persian", 1402), false);
  deepStrictEqual(isLeapYear("persian", 1403), true);
  deepStrictEqual(isLeapYear("persian", 1404), false);

  deepStrictEqual(monthDays("persian", 1402, 12), 29);
  deepStrictEqual(monthDays("persian", 1403, 12), 30);
  deepStrictEqual(monthDays("persian", 1404, 1), 31);
  deepStrictEqual(monthDays("persian", 1404, 7), 30);

  deepStrictEqual(toJD("persian", 1402, 12, 29), toJD("gregorian", 2024, 3, 19));
  deepStrictEqual(toJD("persian", 1403, 1, 1), toJD("gregorian", 2024, 3, 20));
  deepStrictEqual(toJD("persian", 1403, 12, 30), toJD("gregorian", 2025, 3, 20));
  deepStrictEqual(toJD("persian", 1404, 1, 1), toJD("gregorian", 2025, 3, 21));

  const dates: CalendarDate[] = [
    [-1121, 3, 10],
    [0, 1, 1],
    [1, 1, 1],
    [934, 3, 17],
    [1402, 12, 29],
    [1403, 12, 30],
  ];

  for (const date of dates) {
    deepStrictEqual(fromJD("persian", toJD("persian", ...date)), date);
  }
});

test("independently established historical and modern date equivalents", () => {
  // Hebrew epoch: 1 Tishri 1 AM = Monday, 7 October 3761 BCE (Julian -3760)
  const hebrewEpochJD = toJD("hebrew", 1, 7, 1);
  deepStrictEqual(hebrewEpochJD, 347997.5);
  deepStrictEqual(fromJD("julian", hebrewEpochJD), [-3760, 10, 7]);
  deepStrictEqual(weekday(hebrewEpochJD), 1); // Monday

  // Hijra epoch: 1 Muharram 1 AH = Friday, 16 July 622 CE (Julian)
  const hijraJD = toJD("islamic", 1, 1, 1);
  deepStrictEqual(hijraJD, 1948439.5);
  deepStrictEqual(fromJD("julian", hijraJD), [622, 7, 16]);
  deepStrictEqual(fromJD("gregorian", hijraJD), [622, 7, 19]);
  deepStrictEqual(weekday(hijraJD), 5); // Friday

  // README example: 14 Jumada al-Akhira 505 AH = 18 December 1111 CE (Julian)
  deepStrictEqual(fromJD("julian", toJD("islamic", 505, 6, 14)), [1111, 12, 18]);

  // Suleymaniye Mosque foundation: 26 Jumada al-Ula 957 AH = 12 June 1550 CE (Julian)
  deepStrictEqual(fromJD("julian", toJD("islamic", 957, 5, 26)), [1550, 6, 12]);

  // Treaty of Amasya: 29 May 1555 (Julian) = 8 June 1555 (Gregorian) = 8 Rajab 962 AH
  const amasyaJD = toJD("gregorian", 1555, 6, 8);
  deepStrictEqual(fromJD("julian", amasyaJD), [1555, 5, 29]);
  deepStrictEqual(fromJD("islamic", amasyaJD), [962, 7, 8]);

  // Gregorian calendar adoption: Thursday 4 Oct 1582 (Julian) -> Friday 15 Oct 1582 (Gregorian)
  const lastJulianDay = toJD("julian", 1582, 10, 4);
  const firstGregorianDay = toJD("gregorian", 1582, 10, 15);
  deepStrictEqual(firstGregorianDay - lastJulianDay, 1);
  deepStrictEqual(weekday(lastJulianDay), 4); // Thursday
  deepStrictEqual(weekday(firstGregorianDay), 5); // Friday

  // Unix epoch: Thursday, 1 January 1970 (Gregorian)
  const unixEpochJD = toJD("gregorian", 1970, 1, 1);
  deepStrictEqual(unixEpochJD, 2440587.5);
  deepStrictEqual(weekday(unixEpochJD), 4); // Thursday

  // J2000 midnight: Saturday, 1 January 2000 (Gregorian)
  const j2000MidnightJD = toJD("gregorian", 2000, 1, 1);
  deepStrictEqual(j2000MidnightJD, 2451544.5);
  deepStrictEqual(weekday(j2000MidnightJD), 6); // Saturday

  // Nowruz 1404: Friday, 21 March 2025 (Gregorian)
  const nowruz1404JD = toJD("persian", 1404, 1, 1);
  deepStrictEqual(nowruz1404JD, 2460755.5);
  deepStrictEqual(fromJD("gregorian", nowruz1404JD), [2025, 3, 21]);
  deepStrictEqual(fromJD("julian", nowruz1404JD), [2025, 3, 8]);
  deepStrictEqual(fromJD("hebrew", nowruz1404JD), [5785, 12, 21]);
  deepStrictEqual(fromJD("islamic", nowruz1404JD), [1446, 9, 21]);
  deepStrictEqual(weekday(nowruz1404JD), 5); // Friday
});

test("fractional Julian dates roll over consistently at midnight", () => {
  const midnight = toJD("gregorian", 2025, 3, 21); // 2460755.5
  const nextMidnight = toJD("gregorian", 2025, 3, 22); // 2460756.5

  for (const offset of [0, 0.25, 0.5, 0.75, 0.9999]) {
    const jd = midnight + offset;
    deepStrictEqual(fromJD("gregorian", jd), [2025, 3, 21]);
    deepStrictEqual(fromJD("julian", jd), [2025, 3, 8]);
    deepStrictEqual(fromJD("hebrew", jd), [5785, 12, 21]);
    deepStrictEqual(fromJD("islamic", jd), [1446, 9, 21]);
    deepStrictEqual(fromJD("persian", jd), [1404, 1, 1]);
    deepStrictEqual(weekday(jd), 5); // Friday
  }

  deepStrictEqual(fromJD("gregorian", nextMidnight), [2025, 3, 22]);
  deepStrictEqual(fromJD("julian", nextMidnight), [2025, 3, 9]);
  deepStrictEqual(fromJD("hebrew", nextMidnight), [5785, 12, 22]);
  deepStrictEqual(fromJD("islamic", nextMidnight), [1446, 9, 22]);
  deepStrictEqual(fromJD("persian", nextMidnight), [1404, 1, 2]);
  deepStrictEqual(weekday(nextMidnight), 6); // Saturday
});

test("fractional Julian dates around JD 0 and ULP neighbors roll over at midnight", () => {
  const arithmeticCalendars: readonly Calendar[] = ["gregorian", "julian", "hebrew", "islamic"];

  // Immediate representable float below 0.5 (0.5 - 2^-54) must stay on day [-4712, 1, 1]
  const justBeforeHalf = 0.49999999999999994;
  for (const jd of [-0.5, -0.25, -0, 0, 0.25, justBeforeHalf]) {
    deepStrictEqual(fromJD("julian", jd), [-4712, 1, 1]);
    deepStrictEqual(weekday(jd), 1); // Monday
    for (const calendar of arithmeticCalendars) {
      deepStrictEqual(fromJD(calendar, jd), fromJD(calendar, -0.5));
    }
  }

  deepStrictEqual(fromJD("julian", 0.5), [-4712, 1, 2]);
  deepStrictEqual(weekday(0.5), 2); // Tuesday
  for (const calendar of arithmeticCalendars) {
    deepStrictEqual(fromJD(calendar, 0.5), fromJD(calendar, 0.75));
  }

  // Immediate representable float below -0.5 must stay on day [-4713, 12, 31]
  const justBeforeNegHalf = -0.5000000000000001;
  deepStrictEqual(fromJD("julian", justBeforeNegHalf), [-4713, 12, 31]);
  deepStrictEqual(weekday(justBeforeNegHalf), 0); // Sunday
  for (const calendar of arithmeticCalendars) {
    deepStrictEqual(fromJD(calendar, justBeforeNegHalf), fromJD(calendar, -1.5));
  }

  // Immediate representable float below Nowruz 1404 midnight (2460755.5) across all 5 calendars
  const nowruzMidnight = toJD("gregorian", 2025, 3, 21); // 2460755.5
  const justBeforeNowruz = 2460755.4999999995;
  deepStrictEqual(justBeforeNowruz < nowruzMidnight, true);
  deepStrictEqual(fromJD("gregorian", justBeforeNowruz), [2025, 3, 20]);
  deepStrictEqual(fromJD("julian", justBeforeNowruz), [2025, 3, 7]);
  deepStrictEqual(fromJD("hebrew", justBeforeNowruz), [5785, 12, 20]);
  deepStrictEqual(fromJD("islamic", justBeforeNowruz), [1446, 9, 20]);
  deepStrictEqual(fromJD("persian", justBeforeNowruz), [1403, 12, 30]);
  deepStrictEqual(weekday(justBeforeNowruz), 4); // Thursday
});

test("isCalendar narrows valid calendar strings without throwing", () => {
  for (const calendar of CALENDARS) {
    deepStrictEqual(isCalendar(calendar), true);
  }
  for (const bad of ["persianA", "Gregorian", "", "unknown", null, undefined, 0, {}]) {
    deepStrictEqual(isCalendar(bad), false);
  }
});

test("Julian day precision safety cap is enforced consistently", () => {
  for (const outOfBoundsJD of [2 ** 52, -(2 ** 52), 1e20, -1e20]) {
    throws(() => weekday(outOfBoundsJD), RangeError);
    for (const calendar of CALENDARS) {
      throws(() => fromJD(calendar, outOfBoundsJD), RangeError);
    }
  }

  deepStrictEqual(typeof weekday(2 ** 52 - 1), "number");
  deepStrictEqual(fromJD("persian", toJD("gregorian", -1000, 1, 1)), [-1622, 10, 11]);
  deepStrictEqual(fromJD("persian", toJD("gregorian", 3000, 12, 31)), [2379, 10, 10]);
});

test("isValidDate validates dates without throwing", () => {
  deepStrictEqual(isValidDate("gregorian", 2024, 2, 29), true);
  deepStrictEqual(isValidDate("gregorian", 2025, 2, 29), false);
  deepStrictEqual(isValidDate("julian", 1900, 2, 29), true);
  deepStrictEqual(isValidDate("julian", 0, 2, 29), true);
  deepStrictEqual(isValidDate("julian", -1, 2, 29), false);
  deepStrictEqual(isValidDate("hebrew", 5784, 13, 29), true);
  deepStrictEqual(isValidDate("hebrew", 5784, 13, 30), false);
  deepStrictEqual(isValidDate("hebrew", 5785, 13, 1), false);
  deepStrictEqual(isValidDate("islamic", 1445, 12, 30), true);
  deepStrictEqual(isValidDate("islamic", 1446, 12, 30), false);
  deepStrictEqual(isValidDate("islamic", 1446, 2, 30), false);
  deepStrictEqual(isValidDate("persian", 1403, 12, 30), true);
  deepStrictEqual(isValidDate("persian", 1402, 12, 30), false);

  // Nonexistent months, zero/negative days, fractional, nonfinite, unsafe, unknown calendar
  deepStrictEqual(isValidDate("gregorian", 2025, 0, 1), false);
  deepStrictEqual(isValidDate("gregorian", 2025, 13, 1), false);
  deepStrictEqual(isValidDate("gregorian", 2025, 1, 0), false);
  deepStrictEqual(isValidDate("gregorian", 2025, 1, -1), false);
  deepStrictEqual(isValidDate("gregorian", 2025.5, 1, 1), false);
  deepStrictEqual(isValidDate("gregorian", 2025, 1.5, 1), false);
  deepStrictEqual(isValidDate("gregorian", 2025, 1, 1.5), false);
  deepStrictEqual(isValidDate("gregorian", Number.NaN, 1, 1), false);
  deepStrictEqual(isValidDate("gregorian", Number.POSITIVE_INFINITY, 1, 1), false);
  deepStrictEqual(isValidDate("gregorian", Number.MAX_SAFE_INTEGER + 1, 1, 1), false);
  deepStrictEqual(isValidDate("unknown" as Calendar, 2025, 1, 1), false);

  // Non-stringifiable runtime inputs from untyped JS must return false without throwing
  const nullProto = Object.create(null);
  deepStrictEqual(isValidDate(nullProto as Calendar, 2025, 1, 1), false);
  deepStrictEqual(isValidDate("gregorian", Symbol() as unknown as number, 1, 1), false);
  deepStrictEqual(isValidDate("gregorian", 2025, Symbol() as unknown as number, 1), false);
  deepStrictEqual(isValidDate("gregorian", 2025, 1, nullProto as unknown as number), false);
});

test("strict validation throws RangeError on invalid inputs", () => {
  // Non-stringifiable runtime inputs still throw RangeError (not TypeError)
  const nullProto = Object.create(null);
  const { proxy: revokedProxy, revoke } = Proxy.revocable({}, {});
  revoke();
  throws(() => toJD(nullProto as Calendar, 2025, 1, 1), RangeError);
  throws(() => toJD(revokedProxy as Calendar, 2025, 1, 1), RangeError);
  throws(() => toJD("gregorian", Symbol() as unknown as number, 1, 1), RangeError);
  throws(() => toJD("gregorian", revokedProxy as unknown as number, 1, 1), RangeError);
  throws(() => fromJD(nullProto as Calendar, 2460755.5), RangeError);
  throws(() => fromJD("gregorian", Symbol() as unknown as number), RangeError);
  throws(() => weekday(nullProto as unknown as number), RangeError);
  throws(() => isLeapYear("gregorian", Symbol() as unknown as number), RangeError);
  throws(() => monthDays("gregorian", 2025, Symbol() as unknown as number), RangeError);

  // Invalid dates in toJD
  throws(() => toJD("gregorian", 2025, 2, 29), RangeError);
  throws(() => toJD("gregorian", 2025, 0, 1), RangeError);
  throws(() => toJD("gregorian", 2025, 13, 1), RangeError);
  throws(() => toJD("gregorian", 2025, 1, 0), RangeError);
  throws(() => toJD("gregorian", 2025, 1, 1.5), RangeError);
  throws(() => toJD("gregorian", 2025.5, 1, 1), RangeError);
  throws(() => toJD("gregorian", Number.NaN, 1, 1), RangeError);
  throws(() => toJD("gregorian", Number.POSITIVE_INFINITY, 1, 1), RangeError);
  throws(() => toJD("hebrew", 5785, 13, 1), RangeError);
  throws(() => toJD("islamic", 1446, 2, 30), RangeError);
  throws(() => toJD("islamic", 1446, 12, 30), RangeError);
  throws(() => toJD("persian", 1402, 12, 30), RangeError);
  throws(() => toJD("unknown" as Calendar, 2025, 1, 1), RangeError);

  // Invalid Julian days in fromJD and weekday
  for (const badJD of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    throws(() => weekday(badJD), RangeError);
    for (const calendar of CALENDARS) {
      throws(() => fromJD(calendar, badJD), RangeError);
    }
  }
  throws(() => fromJD("hebrew", 1e20), RangeError);
  throws(() => fromJD("unknown" as Calendar, 2460755.5), RangeError);

  // Invalid years and months in metadata helpers
  for (const badYear of [
    2025.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    throws(() => isLeapYear("gregorian", badYear), RangeError);
    throws(() => yearMonths("hebrew", badYear), RangeError);
    throws(() => yearDays("islamic", badYear), RangeError);
    throws(() => monthDays("persian", badYear, 1), RangeError);
  }
  throws(() => monthDays("hebrew", 5785, 13), RangeError);
  throws(() => monthDays("gregorian", 2025, 0), RangeError);
  throws(() => monthDays("gregorian", 2025, 13), RangeError);
  throws(() => monthDays("gregorian", 2025, 1.5), RangeError);
  throws(() => isLeapYear("unknown" as Calendar, 2025), RangeError);
  throws(() => yearMonths("unknown" as Calendar, 2025), RangeError);
  throws(() => yearDays("unknown" as Calendar, 2025), RangeError);
  throws(() => monthDays("unknown" as Calendar, 2025, 1), RangeError);
});

test("sampled midnight round trips pass across all calendars", () => {
  const startJD = toJD("gregorian", -500, 1, 1);
  const endJD = toJD("gregorian", 2500, 1, 1);

  for (let jd = startJD; jd <= endJD; jd += 1003) {
    for (const calendar of CALENDARS) {
      const date = fromJD(calendar, jd);
      deepStrictEqual(isValidDate(calendar, ...date), true);
      deepStrictEqual(toJD(calendar, ...date), jd);
    }
  }
});
