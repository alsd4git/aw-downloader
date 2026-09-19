export interface SonarrCopyReceipt {
  seriesId: number
  relativePath: string
}

export interface SonarrIndexedFileIdentity {
  seriesId: number
  relativePath: string
}

export function normalizeSonarrRelativePath(relativePath: string): string {
  return relativePath.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\/+/, '')
}

/**
 * Post-processing is allowed only for the exact file AW copied.
 *
 * Matching the episode ID alone is not sufficient: another process could have
 * populated the episode between AW's rescan request and the follow-up action.
 */
export function isMatchingSonarrCopy(
  receipt: SonarrCopyReceipt,
  indexedFile: SonarrIndexedFileIdentity
): boolean {
  return (
    receipt.seriesId === indexedFile.seriesId &&
    normalizeSonarrRelativePath(receipt.relativePath) ===
      normalizeSonarrRelativePath(indexedFile.relativePath)
  )
}
