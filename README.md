# unical – Functions for calendar conversion

This is a simple TypeScript library that offers functions for converting between
different calendars. The way that the API works is that you can take a date in
one of several calendars—Gregorian, Julian, Hebrew, Islamic, or Persian (i.e.,
Solar Hijri)—and convert it to the associated
[Julian day number](https://en.wikipedia.org/wiki/Julian_day). Then there are
functions that do the inverse, by converting from a Julian day to a date in any
of those calendars. So you could, for example, convert an Islamic date to its
Julian day, and from there to a Gregorian date. It works just fine; I maintain
this library to support a calendar conversion web app, at
[muqawwim.com](https://www.muqawwim.com/). (See the
[GitHub repo](https://github.com/theodore-s-beers/muqawwim) for that project for
real usage examples.)

`unical` is essentially a fork of the JavaScript code underlying the
[Fourmilab calendar converter](https://www.fourmilab.ch/documents/calendar/) by
[John Walker](https://en.wikipedia.org/wiki/John_Walker_%28programmer%29). His
license, which remains in the source code, is dated 1999. I've been making my
own adjustments, simplifications, and modernizations for several years. At a
certain point, I converted this to TypeScript (not that it involved much work),
to gain some reassurance through type checking. I've also written a handful of
tests and hope to add more.

I haven't published this library to a package registry because I'm doubtful that
it would be of use to anyone else. When I add this as a dependency to one of my
own projects, I pull it directly from GitHub. Again, it works fine. If it does
turn out that others would be interested in using `unical`, then I would be open
to publishing it, adding a feature here and there, etc.
