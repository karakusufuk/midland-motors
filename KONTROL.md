# Kontrol (sürüm 3)

Build: `npm run build` hatasız, 30 statik sayfa. Lighthouse (mobil, yerel preview): Ana sayfa 95/100/100/100 · Stock 96/100/100/100 · Certified 99/100/100/100 · Finance 99/100/100/100 · Araç sayfaları Performance 82–84, diğerleri 100.

| Madde | Durum | Not |
|---|---|---|
| Gerçek yollar (/stock/, /cars/<slug>/, /certified/, /finance/, /privacy/, 404) | ✓ | tarayıcıda gezinme doğrulandı |
| Hero video + başlık "Know where it's been." | ✓ | farlar ≈ 2.8 sn, `HEADLIGHTS` sabiti |
| İlk giriş kadranı | ✓ | `setTimeout` ile, en fazla 1 sn |
| Arama kutusu / filtreler | ✓ | yalnız ana sayfa açılış görüntüsü kontrol edildi |
| Pasaport sahnesi | ✗ | prototipten taşındı, kare kare doğrulanmadı (tarayıcı panosunda animasyon kısıtlı) |
| Muayene krokisi, sağ/sol | ✓ | BMW 3 Series sayfasında bölge seçimi ve boyama görüldü |
| Sabit test sürüşü → footer | ✗ | taşındı, doğrulanmadı |
| Paneller (test sürüşü, takas, ayırma) | ✗ | taşındı, ekranla doğrulanmadı |
| Canlı açık/kapalı | ✗ | taşındı, doğrulanmadı |
| Araç sayfası Lighthouse Performance ≥ 90 | ✗ | 82–84 (içerik istemci tarafında çizildiği için LCP ≈ 4.5 sn simüle) |
| 1440 / 1024 / 390 ekran görüntüsü karşılaştırması | ✗ | yapılmadı, yalnızca 1024 genişlikte bakıldı |
| JSON-LD (Vehicle + Offer) | ✓ | araç sayfalarında |
