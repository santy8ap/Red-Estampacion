import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Puedes obtener el locale de cookies, headers, etc.
  const locale = 'es'; // Por defecto español, luego lo haremos dinámico

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});