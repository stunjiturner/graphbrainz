import test from 'ava'
import { Kind } from 'graphql/language'
import { Locale, Duration, URLString } from '../../src/types/scalars'

test('Locale scalar allows language code', t => {
  t.is(Locale.parseLiteral({ kind: Kind.STRING, value: 'en' }), 'en')
  t.is(Locale.parseLiteral({ kind: Kind.STRING, value: 'jp' }), 'jp')
  t.is(Locale.parseLiteral({ kind: Kind.STRING, value: 'es' }), 'es')
})

test('Locale scalar allows language and country code', t => {
  t.is(Locale.parseLiteral({ kind: Kind.STRING, value: 'en_US' }), 'en_US')
  t.is(Locale.parseLiteral({ kind: Kind.STRING, value: 'en_GB' }), 'en_GB')
  t.is(Locale.parseLiteral({ kind: Kind.STRING, value: 'fr_FR' }), 'fr_FR')
})

test('Locale scalar allows language, country, and encoding', t => {
  t.is(Locale.parseLiteral({ kind: Kind.STRING, value: 'en_US.UTF-8' }), 'en_US.UTF-8')
  t.is(Locale.parseLiteral({ kind: Kind.STRING, value: 'de_CH.utf8' }), 'de_CH.utf8')
  t.is(Locale.parseLiteral({ kind: Kind.STRING, value: 'zh_TW.Big5' }), 'zh_TW.Big5')
})

test('Locale scalar only accepts strings', t => {
  t.is(Locale.parseLiteral({ kind: Kind.INT, value: 5 }), null)
  t.is(Locale.parseLiteral({ kind: Kind.ENUM, value: 'xx' }), null)
})

test('Locale scalar rejects malformed locales', t => {
  t.throws(() => Locale.parseLiteral({ kind: Kind.STRING, value: 'en_' }), TypeError)
  t.throws(() => Locale.parseLiteral({ kind: Kind.STRING, value: 'en_USA' }), TypeError)
  t.throws(() => Locale.parseLiteral({ kind: Kind.STRING, value: 'EN' }), TypeError)
  t.throws(() => Locale.parseLiteral({ kind: Kind.STRING, value: 'en_us' }), TypeError)
  t.throws(() => Locale.parseLiteral({ kind: Kind.STRING, value: 'en-US' }), TypeError)
  t.throws(() => Locale.parseLiteral({ kind: Kind.STRING, value: 'en_US_foo' }), TypeError)
  t.throws(() => Locale.parseLiteral({ kind: Kind.STRING, value: 'en_US-utf8' }), TypeError)
  t.throws(() => Locale.parseLiteral({ kind: Kind.STRING, value: '12_US' }), TypeError)
  t.throws(() => Locale.parseLiteral({ kind: Kind.STRING, value: 'en_US.' }), TypeError)
  t.throws(() => Locale.parseLiteral({ kind: Kind.STRING, value: 'en_US.utf!' }), TypeError)
})

test('Duration scalar must be a positive integer', t => {
  t.is(Duration.parseLiteral({ kind: Kind.INT, value: 0 }), 0)
  t.is(Duration.parseLiteral({ kind: Kind.INT, value: 1 }), 1)
  t.is(Duration.parseLiteral({ kind: Kind.INT, value: 3000 }), 3000)
  t.is(Duration.parseLiteral({ kind: Kind.STRING, value: '1000' }), null)
  t.throws(() => Duration.parseLiteral({ kind: Kind.INT, value: -1 }), TypeError)
  t.throws(() => Duration.parseLiteral({ kind: Kind.INT, value: -1000 }), TypeError)
})

test('URLString scalar must be a valid URL', t => {
  t.is(URLString.parseLiteral({ kind: Kind.INT, value: 1000 }), null)
  t.is(URLString.parseLiteral({ kind: Kind.STRING, value: 'http://www.google.com' }), 'http://www.google.com')
  t.throws(() => URLString.parseLiteral({ kind: Kind.STRING, value: 'foo:bar' }), TypeError)
  t.throws(() => URLString.parseLiteral({ kind: Kind.STRING, value: 'foo:/bar' }), TypeError)
  t.throws(() => URLString.parseLiteral({ kind: Kind.STRING, value: 'foo://bar' }), TypeError)
  t.throws(() => URLString.parseLiteral({ kind: Kind.STRING, value: 'foo://bar.' }), TypeError)
})
