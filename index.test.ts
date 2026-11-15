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
