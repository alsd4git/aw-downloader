import { test } from '@japa/runner'
import {
  isMatchingSonarrCopy,
  normalizeSonarrRelativePath,
} from '../../app/helpers/sonarr_file_provenance.js'

test.group('Sonarr file provenance', () => {
  test('matches the exact file copied by AW', ({ assert }) => {
    assert.isTrue(
      isMatchingSonarrCopy(
        { seriesId: 42, relativePath: 'Saint Seiya - S01E01 [DUB]-AnimeWorld.mp4' },
        { seriesId: 42, relativePath: 'Saint Seiya - S01E01 [DUB]-AnimeWorld.mp4' }
      )
    )
  })

  test('normalizes path separators without broadening the match', ({ assert }) => {
    assert.equal(normalizeSonarrRelativePath('Season 01\\Episode.mp4'), 'Season 01/Episode.mp4')
    assert.isTrue(
      isMatchingSonarrCopy(
        { seriesId: 42, relativePath: 'Season 01/Episode.mp4' },
        { seriesId: 42, relativePath: 'Season 01\\Episode.mp4' }
      )
    )
  })

  test('rejects another file for the same series', ({ assert }) => {
    assert.isFalse(
      isMatchingSonarrCopy(
        { seriesId: 42, relativePath: 'Saint Seiya - S01E01 [DUB]-AnimeWorld.mp4' },
        { seriesId: 42, relativePath: 'Saint Seiya - S01E01.mkv' }
      )
    )
  })

  test('rejects the same relative path from another series', ({ assert }) => {
    assert.isFalse(
      isMatchingSonarrCopy(
        { seriesId: 42, relativePath: 'Episode.mp4' },
        { seriesId: 99, relativePath: 'Episode.mp4' }
      )
    )
  })

  test('rejects a file moved to a different relative path', ({ assert }) => {
    assert.isFalse(
      isMatchingSonarrCopy(
        { seriesId: 42, relativePath: 'Episode.mp4' },
        { seriesId: 42, relativePath: 'Season 01/Episode.mp4' }
      )
    )
  })
})
