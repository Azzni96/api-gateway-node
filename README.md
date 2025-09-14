
# Node.js API Gateway (Express + http-proxy-middleware)
_Päivitetty: 2025-09-14_

**Projektin tarkoitus (lyhyesti ja yksinkertaisesti):**
Yksinkertainen API-gateway rakennettuna **Node.js + TypeScript**. Gatewayllä on kolme proxytettua reittiä:
- `GET /api1/*` → ohjaa kohteeseen **jsonplaceholder.typicode.com**
- `GET /api2/*` → ohjaa kohteeseen **httpbin.org**
- `GET /weather/*` → ohjaa kohteeseen **OpenWeatherMap** ja lisää `appid` automaattisesti `.env`-tiedostosta

> Huom: Ei erillistä `health`-polkua, kuten pyydettiin.

---

## ✅ Esitäytetyt vaatimukset (Prerequisites)
- Node.js (LTS) + npm
- Internet-yhteys (pääsy julkisiin API:hin)
- Luo `.env`-tiedosto projektin juureen

---

## 🧱 Projektin rakenne (Structure)
```
api-gateway-node/
├─ src/
│  └─ server.ts
├─ .env              # paikallinen, älä lisää Git-repoon
├─ .env.example      # esimerkki ilman arkaluontoisia tietoja
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## ⚙️ Nopean käyttöönoton ohjeet (Setup)
1) Asenna riippuvuudet (jos eivät ole vielä asennettuina):
```bash
npm install
```
2) Luo `.env` ja lisää OpenWeatherMap API-avain:
```
PORT=3008
WEATHER_API_KEY=YOUR_OPENWEATHERMAP_KEY
```
> Älä lisää `.env` Git-repoon. Käytä `.env.example` tiedoston jakoa varten.

3) Käynnistä kehitystilassa:
```bash
npm run dev
```
Tai käännä ja käynnistä tuotantotilassa:
```bash
npm run build
npm start
```

---

## 🔗 Endpoints (nopea testi)
> Windows PowerShell: käytä `curl.exe` älä `curl` aliasin välttämiseksi.

- **API 1** (JSONPlaceholder):
  - Selain: `http://localhost:3008/api1/posts`
  - PowerShell:
    ```powershell
    curl.exe "http://localhost:3008/api1/posts"
    ```

- **API 2** (httpbin):
  - Selain: `http://localhost:3008/api2/get`
  - PowerShell:
    ```powershell
    curl.exe "http://localhost:3008/api2/get"
    ```

- **Weather** (OpenWeatherMap) – lisää `appid` automaattisesti:
  - Selain: `http://localhost:3008/weather?q=Helsinki`
  - Toimii myös: `http://localhost:3008/weather/weather?q=Helsinki`
  - PowerShell:
    ```powershell
    curl.exe "http://localhost:3008/weather?q=Helsinki"
    ```

> Gatewayn eteenpäinlähettämä pyyntöpääte OWM:lle näyttää esimerkiksi tältä:
> `/data/2.5/weather?q=Helsinki&appid=***&units=metric`

---

## 🛠️ npm-skriptit
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js"
  }
}
```

---

## 🧪 Tärkeitä huomioita (Troubleshooting)
- **PowerShell pilkkoo merkkijonon ennen `?q=`** → johtaa virheeseen `{"cod":"404","message":"Internal error"}`.  
  Ratkaisu: käytä URL:ia samalla rivillä tai käytä selainta.
- **OWM 401 (Invalid API key)** → avain on virheellinen tai vanhentunut. Tarkista `.env` ja käynnistä palvelin uudelleen.
- **OWM 404 (Internal error)** → todennäköisesti väärä polku. Koodi korjaa polun lisäämällä `/data/2.5` automaattisesti.
- **TLS/SSL-ongelmat sisäisten palveluiden kanssa** → testausta varten aseta `secure: false` proxyn asetuksiin (vain paikalliseen kehitykseen).
- **SELinux/Firewall Linux-palvelimella**: avaa tarvittavat portit (esim. 3008) ja ota `httpd_can_network_connect` käyttöön jos käytät reverse-proxyä (Apache/Nginx).

---

## 🔐 Turvallisuus (Security)
- Älä lisää `.env`-tiedostoa repositoryyn.
- Vaihda OWM-avain säännöllisesti jos se jaetaan tai vuotaa.
- Tuotannossa: laita HTTPS gatewayn eteen (NGINX/Apache tai load balancer).

---

## 🖼️ Kuvakaappaukset (Screenshots)

![screenshot](docs/weather.png)
![screenshot](docs/api1.png)
![screenshot](docs/api2.png)
