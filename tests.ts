import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

import {
  gregorianToJD,
  hebrewLeap,
  islamicToJD,
  jdToIslamic,
  jdToJulian,
  julianToJD,
  leapGregorian,
  leapJulian,
} from "./unical.ts";

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
