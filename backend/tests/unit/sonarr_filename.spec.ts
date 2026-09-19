import { test } from '@japa/runner'
import {
  buildSonarrFilename,
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

  test('sanitizes invalid release group characters deterministically', ({ assert }) => {
    assert.equal(sanitizeReleaseGroup('  Anime World!?  '), 'Anime-World')
    assert.equal(sanitizeReleaseGroup('Group---Part Two'), 'Group-PartTwo')
    assert.isNull(sanitizeReleaseGroup(' !!! '))
  })
})
