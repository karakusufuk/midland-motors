# Sapmalar (sürüm 3)

- Slogan: belge ile PROMPT.md çelişiyordu ("Every kilometre, accounted for." / "Know where it's been."). Prototip "Know where it's been." kullanıyor, onu kullandım.
- Mimari: prototipin istemci tarafı sayfa üretimi (`app.js`) korunup hash rotaları gerçek yollara çevrildi (`/stock/`, `/cars/<slug>/`, `/certified/`, `/finance/`, `/privacy/`). Astro her yol için statik HTML kabuğu üretir (başlık, meta, araç sayfalarında `Vehicle` + `Offer` JSON-LD); içerik tarayıcıda çizilir. Sayfa geçişleri `history.pushState` ile.
- Filtreler sayfalar arasında bellekte korunur; URL'ye yazılmıyor.
- Araba fotoğrafları `public/img/cars/` altında 1280 px WebP (+ `-640`); `<Picture>` / AVIF kullanılmadı.
- Hero: `HERO_HEADLIGHTS_S` ≈ 2.8 sn (parlaklık sıçraması 2.8–3.0 sn arasında ölçüldü), `app.js` içinde `HEADLIGHTS`.
- İlk giriş kadranı `requestAnimationFrame` yerine `setTimeout` ile çalışır (arka plan sekmesinde takılmasın).
- Fontlar `@fontsource` ile kendi sunucudan; prototipteki Google Fonts bağlantısı kaldırıldı.
- ford-focus 01/02 yer değişimi yapılmadı: arabanın fotoğraf listesi zaten 03'ten başlıyor.
- Mobil için ayrı tur yapılmadı; prototipin duyarlı kuralları aynen taşındı.
- Araba fotoğrafları: 1280, 960 (galeri ana görseli) ve 640 (küçük resim, satır, kart) WebP. Araç sayfasında ilk fotoğraf `<link rel=preload>` ile öne alınır.
- Pasaport sahnesi hızı kullanıcı isteğiyle prototipin %60 üstünde (`V = max(300, W*0.25)`), tekerlek bulanıklığı 1.6 → 0.5 px.
- Plakalar fotoğraflara kalıcı işlendi; `scripts/prep.mjs` çalıştırılırsa `scripts/plates.mjs` ve 960 varyantlarının plakaları yeniden uygulanmalı.
