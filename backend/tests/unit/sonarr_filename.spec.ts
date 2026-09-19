import { test } from '@japa/runner'
import {
  buildSonarrFilename,
  sanitizeFilenameMarker,
  sanitizeReleaseGroup,
} from '../../app/helpers/sonarr_filename.js'

test.group('Sonarr filename helper', () => {
  test('keeps the current filename when release group is empty', ({ assert }) => {
    assert.equal(
      buildSonarrFilename({
        seriesTitle: 'Saint Seiya',
        seasonNumber: 12,
        episodeNumber: 1,
        extension: '.mp4',
        releaseGroup: '',
      }),
      'Saint Seiya - S12E01.mp4'
    )
  })

  test('appends a configured release group in a Sonarr-compatible form', ({ assert }) => {
    assert.equal(
      buildSonarrFilename({
        seriesTitle: 'Saint Seiya',
        seasonNumber: 12,
        episodeNumber: 1,
        extension: 'mp4',
        releaseGroup: 'AnimeWorld',
      }),
      'Saint Seiya - S12E01-AnimeWorld.mp4'
    )
  })

  test('adds source and format markers without breaking the trailing release group', ({ assert }) => {
    assert.equal(
      buildSonarrFilename({
        seriesTitle: 'Saint Seiya',
        seasonNumber: 1,
        episodeNumber: 1,
        extension: '.mp4',
        sourceMarker: 'AnimeWorld',
        formatMarker: 'SUB-ITA',
        releaseGroup: 'AnimeWorld',
      }),
      '[AnimeWorld] Saint Seiya - S01E01 [SUB-ITA]-AnimeWorld.mp4'
    )
  })

  test('normalizes configured marker brackets and unsafe characters', ({ assert }) => {
    assert.equal(sanitizeFilenameMarker('[AnimeWorld]'), 'AnimeWorld')
    assert.equal(sanitizeFilenameMarker('SUB/ITA'), 'SUB-ITA')
    assert.isNull(sanitizeFilenameMarker('   '))
  })

  test('sanitizes invalid release group characters deterministically', ({ assert }) => {
    assert.equal(sanitizeReleaseGroup('  Anime World!?  '), 'Anime-World')
    assert.equal(sanitizeReleaseGroup('Group---Part Two'), 'Group-PartTwo')
    assert.isNull(sanitizeReleaseGroup(' !!! '))
  })
})
