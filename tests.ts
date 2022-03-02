import { assertEquals } from 'https://deno.land/std@0.127.0/testing/asserts.ts'
import {
  leapGregorian,
  gregorianToJd,
  jdToGregorian,
  leapJulian,
  hebrewLeap
} from './unical.ts'

Deno.test('leap year', () => {
  const leap: boolean = leapGregorian(2020)
  assertEquals(leap, true)
})

Deno.test('non-leap year', () => {
  const leap: boolean = leapGregorian(1900)
  assertEquals(leap, false)
})

Deno.test('julian leap year', () => {
  const leap: boolean = leapJulian(1900)
  assertEquals(leap, true)
})

Deno.test('hebrew leap year', () => {
  const leap = hebrewLeap(4321)
  assertEquals(leap, true)
})

Deno.test('amasya gregorian to jd', () => {
  const day: number = gregorianToJd(1555, 6, 8)
  assertEquals(day, 2289169.5)
})

Deno.test('amasya jd to gregorian', () => {
  const [year, month, day] = jdToGregorian(2289169.5)
  assertEquals(year, 1555)
  assertEquals(month, 6)
  assertEquals(day, 8)
})
