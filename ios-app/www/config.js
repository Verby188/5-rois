// ══════════════════════════════════════════════════════════════
//  config.js — Configuration de l'application Cinq Couronnes
//  Placer dans : app/src/main/assets/config.js
//  Ce fichier peut être versionné sur GitHub (pas de secret ici)
// ══════════════════════════════════════════════════════════════
window.APP_CONFIG = {

  // Clé API Firebase (identitytoolkit + Realtime Database)
  FIREBASE_KEY: 'AIzaSyCPVnGohf_etSJYIFCSnWxjIB2RPX5rmnU',

  // URL du Cloudflare Worker qui envoie les notifications FCM V1
  // La clé privée Firebase est stockée côté Worker (secret Cloudflare)
  FCM_WORKER_URL: 'https://cinqrois-fcm.verbatim1889.workers.dev',

};
