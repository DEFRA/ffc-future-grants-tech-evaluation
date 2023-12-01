/**
 * Check if the given string is in the URL path
 * @param  {String}   falseCase       Whether to check if the given string is in
 *                                    the URL path or not
 * @param  {String}   expectedUrlPart The string to check for
 */
export default async (falseCase, expectedUrlPart) => {
  /**
     * The URL of the current browser window
     * @type {String}
     */
  const currentUrl = browser.getUrl()

  if (falseCase) {
    await expect(currentUrl).to.not
      .contain(
        expectedUrlPart,
        `Expected URL "${currentUrl}" not to contain ` +
                `"${expectedUrlPart}"`
      )
  } else {
    await expect(currentUrl).to
      .contain(
        expectedUrlPart,
        `Expected URL "${currentUrl}" to contain "${expectedUrlPart}"`
      )
  }
}
