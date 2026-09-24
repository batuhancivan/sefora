# SEFORA | Italian Signature Parfums

SEFORA, Yeni Medya ve İletişim dersi için hazırlanmış kurgusal bir premium parfüm markasıdır. Site; İtalyan estetiği, editoryal moda dili ve frontend üzerinde çalışan bir e-ticaret demosunu bir araya getirir.

Gerçek ödeme alınmaz. Sepet ve favoriler tarayıcıda `localStorage` ile saklanır.

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

Tarayıcıda varsayılan adres:

```
http://localhost:5173/
```

## Production derlemesi

```bash
npm run build
npm run preview
```

## GitHub Pages

Proje `HashRouter` ve Vite `base: './'` ile yayınlanır. Repo adı değişse bile göreli asset yolları çalışır.

1. Depoyu GitHub’a yükleyin.
2. Settings → Pages → Source: **GitHub Actions** seçin.
3. `main` (veya `master`) dalına push edin.
4. `.github/workflows/deploy.yml` derlemeyi yapıp Pages’e yükler.

Manuel yayın için `dist` klasörünü Pages’e de verebilirsiniz. Adres şu biçiminde olur:

`https://<kullanici>.github.io/<repo>/`

İç sayfalar hash route kullanır: `https://<kullanici>.github.io/<repo>/#/kadin`

## Teknoloji

- React + Vite
- React Router (`HashRouter`)
- CSS (özel tasarım sistemi, hazır şablon yok)

## Not

Footer’daki ödev ibaresi değiştirilmemelidir:

> Yeni Medya Ve İletişim Ödevi İçin Batuhan Civan Tarafından Hazırlanmıştır
