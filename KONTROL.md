# Kontrol (sürüm 3)

Build: `npm run build` hatasız, 30 statik sayfa.
Lighthouse mobil (Performance / Accessibility / Best Practices / SEO): Ana sayfa 92/100/100/100 · Stock 94/100/100/100 · BMW 3 Series 90/100/100/100 · GLC 96/100/100/100 · Peugeot 208 94/100/100/100 · Certified 98/100/100/100 · Finance 98/100/100/100.
Taşma taraması (Chrome; 1440/1280/1100/1024/834/768/600/390/360 × 6 sayfa): yatay taşma yok, header tek satır.

| Madde | Durum | Not |
|---|---|---|
| Gerçek yollar (/stock/, /cars/<slug>/, /certified/, /finance/, /privacy/, 404) | ✓ | |
| Hero video + "Know where it's been." | ✓ | farlar ≈ 2.8 sn (`HEADLIGHTS`) |
| İlk giriş kadranı | ✓ | |
| Arama kutusu, filtreler, "Show N cars", Clear all | ✓ | |
| Pasaport sahnesi | ✓ | 20 Ekim isteği: araba ve yol ~%60 hızlandı, tekerlek bulanıklığı düşürüldü, giriş 0.9 sn, toplam ≈ 22 sn |
| Muayene krokisi, sağ/sol | ✓ | kroki görselleri ekrana yaklaşınca yüklenir |
| Galeri tam ekran, Esc ve oklar | ✓ | |
| Takas paneli | ✓ | uçtan uca |
| Test sürüşü paneli | ✓ | uçtan uca: "See you Wednesday 21 October at 11:00." |
| Ayırma paneli | ✓ | uçtan uca: "yours until Monday, 26 October" |
| Canlı açık/kapalı | ✓ | |
| Sabit test sürüşü → footer | ✓ | belirir, footer'da morph olur, geri kaydırınca ayrılır (sınıflarla doğrulandı) |
| Plakalar | ✓ | i30 ×2, 208, 3008 ×2 düz #1E2124 ile kapatıldı (`scripts/plates.mjs`) |
| JSON-LD (Vehicle + Offer) | ✓ | |
| Prototiple yan yana ekran karşılaştırması | ✗ | elle sayfa sayfa bakıldı, piksel karşılaştırması yapılmadı |
