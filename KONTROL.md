# Kontrol (sürüm 3)

Build: `npm run build` hatasız, 30 statik sayfa. Lighthouse mobil (yerel preview, sıkıştırmasız sunucu): Ana sayfa 92/100/100/100 · Stock 93/100/100/100 · Certified ≈94/100/100/100 · Finance ≈95/100/100/100 · Araç sayfaları Performance 78–84, diğer kategoriler 100.
Taşma taraması (Chrome, 1440/1280/1100/1024/834/768/600/390/360 × 6 sayfa): yatay taşma yok, header tek satır.

| Madde | Durum | Not |
|---|---|---|
| Gerçek yollar (/stock/, /cars/<slug>/, /certified/, /finance/, /privacy/, 404) | ✓ | tarayıcıda gezinme doğrulandı |
| Hero video + "Know where it's been." (farlarla kelime kelime yanar) | ✓ | farlar ≈ 2.8 sn (`HEADLIGHTS`), ekran görüntüsüyle doğrulandı |
| İlk giriş kadranı | ✓ | `setTimeout` ile, en fazla 1 sn |
| Arama kutusu, filtreler, canlı "Show N cars", Clear all | ✓ | Diesel 5, +1 owner 4 araba; temizleyince 24 |
| Pasaport sahnesi | ✓ | araba girer, duraklar akar, son durakta durur, logo çizilir, CTA + Replay (1440 ve 390) |
| Muayene krokisi, bölge seçimi, sağ/sol | ✓ | |
| Galeri tam ekran, Esc ve oklar | ✓ | oklar eklendi |
| Paneller: takas, test sürüşü (açılış), ayırma (açılış) | ✓ | takas akışı uçtan uca çalıştı (€13,600 – €14,700) |
| Test sürüşü onay adımı, ayırma onayı | ✗ | uçtan uca denenmedi |
| Canlı açık/kapalı | ✓ | "Closed now · opens today at 9am" |
| Sabit test sürüşü → footer morph | ✗ | taşındı, ekranla doğrulanmadı (hareket) |
| Araç sayfası Lighthouse Performance ≥ 90 | ✗ | 78–84; 175 KB JS, sunucu sıkıştırması yok, içerik istemcide çiziliyor |
| JSON-LD (Vehicle + Offer) | ✓ | araç sayfalarında |
| Plakaların kapatılması | ✗ | önemsiz denmişti, yapılmadı |
