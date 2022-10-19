import { assertEquals } from 'https://deno.land/std@0.127.0/testing/asserts.ts'
import {
  leapGregorian,
  gregorianToJD,
  leapJulian,
  hebrewLeap,
  islamicToJD,
  jdToJulian,
  jdToIslamic,
  julianToJD
} from './unical.ts'

Deno.test('gregorian 2020 leap', () => {
  const leap = leapGregorian(2020)
  assertEquals(leap, true)
})

Deno.test('gregorian 1900 non-leap', () => {
  const leap = leapGregorian(1900)
  assertEquals(leap, false)
})

Deno.test('julian 1900 leap', () => {
  const leap = leapJulian(1900)
  assertEquals(leap, true)
})

Deno.test('hebrew 4321 leap', () => {
  const leap = hebrewLeap(4321)
  assertEquals(leap, true)
})

Deno.test('amasya gregorian to julian', () => {
  const jd = gregorianToJD(1555, 6, 8)
  const [year, month, day] = jdToJulian(jd)
  assertEquals(year, 1555)
  assertEquals(month, 5)
  assertEquals(day, 29)
})

Deno.test('amasya julian to islamic', () => {
  const jd = julianToJD(1555, 5, 29)
  const [year, month, day] = jdToIslamic(jd)
  assertEquals(year, 962)
  assertEquals(month, 7)
  assertEquals(day, 8)
})

Deno.test('suleymaniye islamic to julian', () => {
  const jd = islamicToJD(957, 5, 26)
  const [year, month, day] = jdToJulian(jd)
  assertEquals(year, 1550)
  assertEquals(month, 6)
  assertEquals(day, 12)
})
