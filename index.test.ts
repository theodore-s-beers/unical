import { assertEquals } from "jsr:@std/assert";

import {
  gregorianToJD,
  hebrewLeap,
  hebrewToJD,
  hebrewYearDays,
  islamicToJD,
  jdToHebrew,
  jdToIslamic,
  jdToJulian,
  jdToPersianA,
  julianToJD,
  leapGregorian,
  leapJulian,
  leapPersianA,
  persianAToJD,
} from "./index.ts";

Deno.test("gregorian 2020 leap", () => {
  assertEquals(leapGregorian(2020), true);
});

Deno.test("gregorian 1900 non-leap", () => {
  assertEquals(leapGregorian(1900), false);
});

Deno.test("julian 1900 leap", () => {
  assertEquals(leapJulian(1900), true);
});

Deno.test("hebrew 4321 leap", () => {
  assertEquals(hebrewLeap(4321), true);
});

Deno.test("hebrew year and month boundaries", () => {
  assertEquals(jdToHebrew(gregorianToJD(2023, 9, 15)), [5783, 6, 29]);
  assertEquals(jdToHebrew(gregorianToJD(2023, 9, 16)), [5784, 7, 1]);
  assertEquals(jdToHebrew(gregorianToJD(2024, 4, 8)), [5784, 13, 29]);
  assertEquals(jdToHebrew(gregorianToJD(2024, 4, 9)), [5784, 1, 1]);
});

Deno.test("hebrew dates round trip", () => {
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
    assertEquals(jdToHebrew(hebrewToJD(...date)), date);
  }
});

Deno.test("hebrew year lengths", () => {
  assertEquals(hebrewYearDays(5783), 355);
  assertEquals(hebrewYearDays(5784), 383);
});

Deno.test("amasya gregorian to julian", () => {
  const jd = gregorianToJD(1555, 6, 8);
  const [year, month, day] = jdToJulian(jd);
  assertEquals([year, month, day], [1555, 5, 29]);
});

Deno.test("amasya julian to islamic", () => {
  const jd = julianToJD(1555, 5, 29);
  const [year, month, day] = jdToIslamic(jd);
  assertEquals([year, month, day], [962, 7, 8]);
});

Deno.test("suleymaniye islamic to julian", () => {
  const jd = islamicToJD(957, 5, 26);
  const [year, month, day] = jdToJulian(jd);
  assertEquals([year, month, day], [1550, 6, 12]);
});

Deno.test("islamic dates round trip", () => {
  const dates: [number, number, number][] = [
    [1, 1, 1],
    [2, 12, 30],
    [957, 5, 26],
    [1445, 12, 30],
    [1446, 2, 29],
    [1446, 3, 30],
  ];

  for (const date of dates) {
    assertEquals(jdToIslamic(islamicToJD(...date)), date);
  }
});

Deno.test("persian new year boundaries", () => {
  assertEquals(jdToPersianA(gregorianToJD(2024, 3, 19)), [1402, 12, 29]);
  assertEquals(jdToPersianA(gregorianToJD(2024, 3, 20)), [1403, 1, 1]);
  assertEquals(jdToPersianA(gregorianToJD(2025, 3, 20)), [1403, 12, 30]);
  assertEquals(jdToPersianA(gregorianToJD(2025, 3, 21)), [1404, 1, 1]);
});

Deno.test("persian dates round trip", () => {
  const dates: [number, number, number][] = [
    [-1121, 3, 10],
    [1, 1, 1],
    [934, 3, 17],
    [1402, 12, 29],
    [1403, 12, 30],
  ];

  for (const date of dates) {
    assertEquals(jdToPersianA(persianAToJD(...date)), date);
  }
});

Deno.test("persian leap years", () => {
  assertEquals(leapPersianA(1402), false);
  assertEquals(leapPersianA(1403), true);
  assertEquals(leapPersianA(1404), false);
});
