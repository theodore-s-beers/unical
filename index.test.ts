import { deepStrictEqual } from "node:assert";
import { test } from "node:test";

import {
  gregorianToJD,
  hebrewLeap,
  hebrewToJD,
  hebrewYearDays,
  islamicToJD,
  jdToGregorian,
  jdToHebrew,
  jdToIslamic,
  jdToJulian,
  jdToPersianA,
  julianToJD,
  jWeekday,
  leapGregorian,
  leapIslamic,
  leapJulian,
  leapPersianA,
  persianAToJD,
} from "./index.ts";

test("gregorian 2020 leap", () => {
  deepStrictEqual(leapGregorian(2020), true);
});

test("gregorian 1900 non-leap", () => {
  deepStrictEqual(leapGregorian(1900), false);
});

test("julian 1900 leap", () => {
  deepStrictEqual(leapJulian(1900), true);
});

test("julian leap years across negative, zero, and positive years", () => {
  for (let year = -20; year <= 20; year++) {
    const yearLength = julianToJD(year + 1, 1, 1) - julianToJD(year, 1, 1);
    deepStrictEqual(leapJulian(year), yearLength === 366);
  }
});

test("julian astronomical year zero and negative years", () => {
  const dates: [number, number, number][] = [
    [-4712, 1, 1],
    [-4, 2, 29],
    [-1, 12, 31],
    [0, 1, 1],
    [0, 2, 29],
    [0, 12, 31],
    [1, 1, 1],
  ];

  for (const date of dates) {
    deepStrictEqual(jdToJulian(julianToJD(...date)), date);
  }

  deepStrictEqual(julianToJD(-4712, 1, 1), -0.5);
  deepStrictEqual(julianToJD(0, 1, 1) - julianToJD(-1, 12, 31), 1);
  deepStrictEqual(julianToJD(1, 1, 1) - julianToJD(0, 12, 31), 1);
  deepStrictEqual(julianToJD(0, 1, 3), gregorianToJD(0, 1, 1));
  deepStrictEqual(julianToJD(1, 1, 1), gregorianToJD(0, 12, 30));
});

test("hebrew 4321 leap", () => {
  deepStrictEqual(hebrewLeap(4321), true);
});

test("hebrew year and month boundaries", () => {
  deepStrictEqual(jdToHebrew(gregorianToJD(2023, 9, 15)), [5783, 6, 29]);
  deepStrictEqual(jdToHebrew(gregorianToJD(2023, 9, 16)), [5784, 7, 1]);
  deepStrictEqual(jdToHebrew(gregorianToJD(2024, 4, 8)), [5784, 13, 29]);
  deepStrictEqual(jdToHebrew(gregorianToJD(2024, 4, 9)), [5784, 1, 1]);
});

test("hebrew dates round trip", () => {
  const dates: [number, number, number][] = [
    [-100, 7, 1],
    [1, 7, 1],
    [5783, 12, 29],
    [5784, 7, 1],
    [5784, 12, 30],
    [5784, 13, 1],
    [5784, 1, 1],
    [5784, 6, 29],
  ];

  for (const date of dates) {
    deepStrictEqual(jdToHebrew(hebrewToJD(...date)), date);
  }
});

test("hebrew year lengths", () => {
  deepStrictEqual(hebrewYearDays(5783), 355);
  deepStrictEqual(hebrewYearDays(5784), 383);
});

test("amasya gregorian to julian", () => {
  const jd = gregorianToJD(1555, 6, 8);
  const [year, month, day] = jdToJulian(jd);
  deepStrictEqual([year, month, day], [1555, 5, 29]);
});

test("amasya julian to islamic", () => {
  const jd = julianToJD(1555, 5, 29);
  const [year, month, day] = jdToIslamic(jd);
  deepStrictEqual([year, month, day], [962, 7, 8]);
});

test("suleymaniye islamic to julian", () => {
  const jd = islamicToJD(957, 5, 26);
  const [year, month, day] = jdToJulian(jd);
  deepStrictEqual([year, month, day], [1550, 6, 12]);
});

test("islamic leap years", () => {
  for (let year = -60; year <= 60; year++) {
    const yearLength = islamicToJD(year + 1, 1, 1) - islamicToJD(year, 1, 1);
    deepStrictEqual(leapIslamic(year), yearLength === 355);
  }
});

test("islamic dates round trip", () => {
  const dates: [number, number, number][] = [
    [1, 1, 1],
    [2, 12, 30],
    [957, 5, 26],
    [1445, 12, 30],
    [1446, 2, 29],
    [1446, 3, 30],
  ];

  for (const date of dates) {
    deepStrictEqual(jdToIslamic(islamicToJD(...date)), date);
  }
});

test("persian new year boundaries", () => {
  deepStrictEqual(jdToPersianA(gregorianToJD(2024, 3, 19)), [1402, 12, 29]);
  deepStrictEqual(jdToPersianA(gregorianToJD(2024, 3, 20)), [1403, 1, 1]);
  deepStrictEqual(jdToPersianA(gregorianToJD(2025, 3, 20)), [1403, 12, 30]);
  deepStrictEqual(jdToPersianA(gregorianToJD(2025, 3, 21)), [1404, 1, 1]);
});

test("persian dates round trip", () => {
  const dates: [number, number, number][] = [
    [-1121, 3, 10],
    [1, 1, 1],
    [934, 3, 17],
    [1402, 12, 29],
    [1403, 12, 30],
  ];

  for (const date of dates) {
    deepStrictEqual(jdToPersianA(persianAToJD(...date)), date);
  }
});

test("persian conversions use midnight Julian days", () => {
  deepStrictEqual(persianAToJD(1402, 12, 29), gregorianToJD(2024, 3, 19));
  deepStrictEqual(persianAToJD(1403, 1, 1), gregorianToJD(2024, 3, 20));
  deepStrictEqual(persianAToJD(1403, 12, 30), gregorianToJD(2025, 3, 20));
  deepStrictEqual(persianAToJD(1404, 1, 1), gregorianToJD(2025, 3, 21));
});

test("persian dates convert directly to other calendars and weekdays", () => {
  const jd = persianAToJD(1404, 1, 1);
  deepStrictEqual(jdToGregorian(jd), [2025, 3, 21]);
  deepStrictEqual(jdToJulian(jd), [2025, 3, 8]);
  deepStrictEqual(jWeekday(jd), 5); // Friday
});

test("persian leap years", () => {
  deepStrictEqual(leapPersianA(1402), false);
  deepStrictEqual(leapPersianA(1403), true);
  deepStrictEqual(leapPersianA(1404), false);
});

test("fractional Julian dates roll over consistently at midnight", () => {
  const midnight = gregorianToJD(2025, 3, 21); // 2460755.5
  const nextMidnight = gregorianToJD(2025, 3, 22); // 2460756.5

  for (const offset of [0, 0.25, 0.5, 0.75, 0.9999]) {
    const jd = midnight + offset;
    deepStrictEqual(jdToGregorian(jd), [2025, 3, 21]);
    deepStrictEqual(jdToJulian(jd), [2025, 3, 8]);
    deepStrictEqual(jdToHebrew(jd), [5785, 12, 21]);
    deepStrictEqual(jdToIslamic(jd), [1446, 9, 21]);
    deepStrictEqual(jdToPersianA(jd), [1404, 1, 1]);
    deepStrictEqual(jWeekday(jd), 5); // Friday
  }

  deepStrictEqual(jdToGregorian(nextMidnight), [2025, 3, 22]);
  deepStrictEqual(jdToJulian(nextMidnight), [2025, 3, 9]);
  deepStrictEqual(jdToHebrew(nextMidnight), [5785, 12, 22]);
  deepStrictEqual(jdToIslamic(nextMidnight), [1446, 9, 22]);
  deepStrictEqual(jdToPersianA(nextMidnight), [1404, 1, 2]);
  deepStrictEqual(jWeekday(nextMidnight), 6); // Saturday
});
