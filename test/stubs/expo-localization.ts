// Tests run in jsdom where the native localization module is unavailable. The
// app is French-first, so the stub reports a French device locale to keep the
// default language (and every asserted string) French.
export const getLocales = () => [
  {
    languageCode: "fr",
    languageTag: "fr-FR",
    regionCode: "FR",
    currencyCode: "EUR",
    currencySymbol: "€",
    decimalSeparator: ",",
    digitGroupingSeparator: " ",
    textDirection: "ltr" as const,
    measurementSystem: "metric" as const,
    temperatureUnit: "celsius" as const,
  },
]
