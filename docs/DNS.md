# DNS for playkeep.io

GitHub Pages is configured for:

- Repository: `acrive82/playkeep.io`
- Publishing source: `main` branch, `/docs` folder
- Custom domain: `playkeep.io`
- CNAME file: `docs/CNAME`

## Required DNS Records

Configure these records at the DNS provider for `playkeep.io`.

### Apex Domain

Create four `A` records for `playkeep.io`:

```text
Type  Name  Value
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
```

If the DNS provider supports `ALIAS` or `ANAME` at the apex, that can point to:

```text
acrive82.github.io
```

Do not create a `CNAME` at the apex unless the DNS provider explicitly offers CNAME flattening.

### WWW Subdomain

Create a `CNAME` record for `www.playkeep.io`:

```text
Type   Name  Value
CNAME  www   acrive82.github.io
```

GitHub Pages will redirect between `www.playkeep.io` and `playkeep.io` when both variants are correctly configured.

## Optional IPv6 Records

GitHub Pages also supports `AAAA` records:

```text
Type  Name  Value
AAAA  @     2606:50c0:8000::153
AAAA  @     2606:50c0:8001::153
AAAA  @     2606:50c0:8002::153
AAAA  @     2606:50c0:8003::153
```

## HTTPS

After DNS resolves correctly, GitHub provisions a certificate automatically. HTTPS enforcement may take time to become available.

## Verification Commands

```bash
dig playkeep.io +noall +answer
dig www.playkeep.io +noall +answer
```

Expected apex answers should include the four GitHub Pages `A` records. Expected `www` answer should include `acrive82.github.io`.

References:

- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https

