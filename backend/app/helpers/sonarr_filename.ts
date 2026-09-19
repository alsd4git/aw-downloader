export interface SonarrFilenameOptions {
  seriesTitle: string
  seasonNumber: number
  episodeNumber: number
  extension: string
  releaseGroup?: string | null
  sourceMarker?: string | null
  formatMarker?: string | null
}

/**
 * Sanitize a filename component using the same substitutions already used by AW
 * before handing files to Sonarr.
 */
export function sanitizeSonarrFilenamePart(filename: string): string {
  let sanitized = filename

  sanitized = sanitized.replace(/[\*:]/g, '-')
  sanitized = sanitized.replace(/\//g, '+')
  sanitized = sanitized.replace(/\?/g, '!')
  sanitized = sanitized.replace(/[|\\<>"]/g, '')
  sanitized = sanitized.replace(/^\.+/, '')

  return sanitized.trim()
}

/**
 * Normalize a configured release group to the subset reliably parsed by Sonarr:
 * latin letters, digits and at most one internal hyphen.
 */
export function sanitizeReleaseGroup(releaseGroup?: string | null): string | null {
  if (!releaseGroup) {
    return null
  }

  const normalized = releaseGroup
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!normalized) {
    return null
  }

  const segments = normalized.split('-')
  if (segments.length <= 2) {
    return normalized
  }

  return `${segments[0]}-${segments.slice(1).join('')}`
}

/**
 * Normalize a human-readable marker while keeping it safe as a filename component.
 * Brackets are stripped because the builder adds them consistently.
 */
export function sanitizeFilenameMarker(marker?: string | null): string | null {
  if (!marker) {
    return null
  }

  const sanitized = marker
    .trim()
    .replace(/^\[+|\]+$/g, '')
    .replace(/[\/:*?"<>|]/g, '-')
    .replace(/-+/g, '-')
    .trim()

  return sanitized || null
}

/**
 * Build the temporary filename AW places in the Sonarr series folder.
 *
 * Sonarr's release-group parser reliably recognises a trailing "-Group" token,
 * so an optional configured release group is appended in that form.
 */
export function buildSonarrFilename({
  seriesTitle,
  seasonNumber,
  episodeNumber,
  extension,
  releaseGroup,
  sourceMarker,
  formatMarker,
}: SonarrFilenameOptions): string {
  const sanitizedTitle = sanitizeSonarrFilenamePart(seriesTitle)
  const seasonStr = seasonNumber.toString().padStart(2, '0')
  const episodeStr = episodeNumber.toString().padStart(2, '0')
  const normalizedExtension = extension && !extension.startsWith('.') ? `.${extension}` : extension
  const sanitizedReleaseGroup = sanitizeReleaseGroup(releaseGroup)
  const sanitizedSourceMarker = sanitizeFilenameMarker(sourceMarker)
  const sanitizedFormatMarker = sanitizeFilenameMarker(formatMarker)
  const sourcePrefix = sanitizedSourceMarker ? `[${sanitizedSourceMarker}] ` : ''
  const formatSuffix = sanitizedFormatMarker ? ` [${sanitizedFormatMarker}]` : ''
  const releaseGroupSuffix = sanitizedReleaseGroup ? `-${sanitizedReleaseGroup}` : ''

  return `${sourcePrefix}${sanitizedTitle} - S${seasonStr}E${episodeStr}${formatSuffix}${releaseGroupSuffix}${normalizedExtension}`
}
