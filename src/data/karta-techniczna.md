# 🏗️ KARTA TECHNICZNA DZIAŁKI — Projekt "Oaza Spokoju"

> **Przeznaczenie dokumentu:** Kompletna baza danych działki zoptymalizowana pod przetwarzanie przez modele LLM.
> **Ostatnia aktualizacja:** 2026-05-24
> **Źródła danych:** PZT (Plan Zagospodarowania Terenu) z 08.2022 (arch. Andrzej Bręnek, Pracownia PROCEL), mapa SIP miasta Cieszyna (miastocieszyn.geoportal2.pl), dane geodezyjne

> **UWAGA 2026-05-24:** ten plik jest notatką historyczną i zawiera starsze opisy sąsiedztwa/współrzędnych. Aktualnym źródłem prawdy dla aplikacji jest `src/data/karta-techniczna.ts`: EGiB `240301_1.0002.4/5`, centroid `49.7730294, 18.6456357`, sąsiedzi bezpośredni: Z `4/10`, P `4/4`, Poł `4/6`, Wschód `25/27, 25/20, 25/18`, NMT GUGiK `366.8-369.8 m`.

---

## 1. IDENTYFIKACJA DZIAŁKI

| Parametr | Wartość |
|---|---|
| **Numer działki** | 4/5 |
| **Obręb** | 240301_1.0002 |
| **Miejscowość** | Cieszyn |
| **Ulica dojazdowa** | Północna (droga niepubliczna, ślepa) |
| **Województwo** | śląskie |
| **Powiat** | cieszyński |
| **Gmina** | Cieszyn (miasto) |
| **Przeznaczenie MPZP** | 67MN — Tereny zabudowy mieszkaniowej jednorodzinnej |
| **Klasa gruntu (użytek)** | PsIV (Pastwiska trwałe klasy IV) |
| **Współrzędne** | N: 49°46'22.89", E: 18°38'43.3" |
| **Identyfikator Geoportal** | X: 5515376.45, Y: 6546483.35 |
| **MPZP — uchwała bazowa** | Nr IV/8/2014 Rady Miejskiej Cieszyna z 18.12.2014 (obszar C — Bobrek/Liburnia/Pastwisk) |
| **Zmiany MPZP** | Nr XXXVI/345/17, Nr XXXVI/346/17, Nr IX/86/19, Nr X/100/19 |

---

## 2. GEOMETRIA I WYMIARY DZIAŁKI

| Parametr | Wartość | Źródło |
|---|---|---|
| **Kształt** | Prostokąt, dłuższy bok w osi W–E | PZT |
| **Długość (oś W–E)** | **43,72 m** | PZT — zwymiarowane |
| **Szerokość (oś N–S)** | **21,05 m** | PZT — zwymiarowane |
| **Powierzchnia** | **~920 m²** | obliczone (43,72 × 21,05) |

### 2.1 Podział wymiarowy osi W–E (od granicy zachodniej/drogi):

| Od [m] | Do [m] | Odcinek [m] | Co zawiera |
|---|---|---|---|
| 0,00 | 9,80 | **9,80** | Strefa podjazdu — od granicy zachodniej (droga) do ściany zachodniej budynku |
| 9,80 | 11,60 | **1,80** | Przejście/chodnik boczny (między garażem a granicą podjazdu) |
| 11,60 | 25,14 | **13,54** | Oś budynku + taras wschodni (budynek 12,50 m + taras ~1,04 m) |
| 25,14 | 43,72 | **18,58** | Ogród wschodni — aż do granicy wschodniej |
| **SUMA** | | **43,72** | ✓ |

### 2.2 Podział wymiarowy osi N–S (od granicy południowej):

| Od [m] | Do [m] | Odcinek [m] | Co zawiera |
|---|---|---|---|
| 0,00 | 7,21 | **7,21** | Pas od granicy południowej do ściany południowej budynku |
| 7,21 | 18,05 | **10,84** | Budynek (wymiar N–S) |
| 18,05 | 21,05 | **~3,00** | Pas od ściany północnej budynku do granicy północnej |
| **SUMA** | | **21,05** | ✓ |

### 2.3 Wymiary z podziałem na odcinki górnej krawędzi (oś W–E, od granicy zachodniej wzdłuż granicy N):

Odczytane z PZT: **10,00 + 15,34 + 18,38 = 43,72 m** ✓

- **10,00 m** — od narożnika NW działki do… (granica podjazdu / linia zabudowy?)
- **15,34 m** — środkowa sekcja (budynek + okolica)
- **18,38 m** — od budynku do narożnika NE działki

---

## 3. ORIENTACJA — STRONY ŚWIATA (SKORYGOWANE)

### 3.1 Jak czytać PZT:
Strzałka **N** na rysunku PZT wskazuje **w prawo i lekko do góry**. Mapa jest zorientowana tak, że:
- **LEWA STRONA rysunku** = **ZACHÓD** (droga dojazdowa, ul. Północna)
- **PRAWA STRONA rysunku** = **WSCHÓD** (ogród, tereny zielone)
- **GÓRA rysunku** = **PÓŁNOC** (dz. 4/4)
- **DÓŁ rysunku** = **POŁUDNIE** (dz. 4/8)

### 3.2 Sąsiedztwo:

| Strona świata | Co jest | Sąsiednia działka | Na rysunku PZT |
|---|---|---|---|
| **ZACHÓD** | Droga dojazdowa — ul. Północna (niepubliczna, ślepa). Wjazd na posesję. | dz. 31/14, 31/13 (droga) | LEWA strona |
| **PÓŁNOC** | Sąsiednia działka, niższy teren, dalej las | dz. **4/4** | GÓRA |
| **POŁUDNIE** | Sąsiednia działka | dz. **4/8** | DÓŁ |
| **WSCHÓD** | Tereny zielone/zadrzewione (PsIV, Lzr) → dalej droga obwodowa | dz. **4/3**, dalej las | PRAWA strona |

### 3.3 Ekspozycja słoneczna:
- **WSCHÓD (ogród/las):** Poranne słońce — główna oś widokowa, przeszklenia HST w salonie
- **POŁUDNIE (dz. 4/8):** Pełne nasłonecznienie przez cały dzień — kuchnia, jadalnia, taras narożny
- **ZACHÓD (droga):** Wieczorne słońce — buforowane garażem, kotłownią ("pancerz prywatności")
- **PÓŁNOC (dz. 4/4):** Równomierne światło rozproszone — biuro, idealne do pracy przy monitorze

---

## 4. TOPOGRAFIA — RZĘDNE TERENU

### 4.1 Kluczowy wniosek:
Teren rośnie **z PÓŁNOCNEGO-ZACHODU na POŁUDNIOWY-WSCHÓD**. Najniższy punkt to okolice drogi/wjazdu (NW), najwyższy — daleko na SE za działką.

### 4.2 Rzędne odczytane z PZT (na i wokół działki 4/5):

| Lokalizacja na rysunku | Rzędna [m n.p.m.] | Strona świata | Opis |
|---|---|---|---|
| Przy drodze, na lewo od podjazdu | **366,2** | ZACHÓD | Najniższy punkt w okolicy wjazdu |
| Narożnik NW działki (lewy górny) | **~367,4** | PÓŁNOCNY-ZACHÓD | Przy granicy z dz. 4/4 i drogą |
| Narożnik SW (lewy dolny) | **367,6** | POŁUDNIOWY-ZACHÓD | Wpisane na PZT: "367,6 Działka nr 4/5" |
| Teren przy garażu (zachodnia ściana budynku) | **~367,4** | ZACHÓD | Teren przed garażem |
| **±0,00 budynku** | **368,45** | CENTRUM | Zaprojektowany poziom parteru |
| Teren przy granicy N budynku | **~367,9–368,0** | PÓŁNOC | Niżej niż ±0,00 |
| Teren na osi przyłączy (N od budynku) | **367,9 → 368,5** | PÓŁNOC → NE | Rośnie na wschód |
| Narożnik NE działki (prawy górny) | **~367,77** | PÓŁNOCNY-WSCHÓD | Odczyt "367.77" na PZT ⚠️ |
| Granica wschodnia — środek | **~369,0** | WSCHÓD | Odczyt z PZT |
| Narożnik SE działki (prawy dolny) | **~369,2** | POŁUDNIOWY-WSCHÓD | Najwyższy punkt NA DZIAŁCE |

### 4.3 Rzędne terenu WOKÓŁ działki (z szerszej mapy PZT):

| Lokalizacja | Rzędna [m n.p.m.] | Uwagi |
|---|---|---|
| Dz. 4/3 (na N od 4/4) | 364,7 – 365,4 | Znacząco niżej! Skarpa na północ |
| Dz. 4/4 (bezpośrednio na N) | 366,5 – 367,1 | Niżej niż działka 4/5 |
| Dz. 4/10 (na NW) | 365,4 – 366,1 | Dolina/skarpa |
| Dz. 4/8 (na S) | 368,0 – 369,3 | Podobny poziom do 4/5, lekko wyżej na E |
| Dz. 4/6 (na SE od 4/8) | 369,3 – 370,0 | Teren rośnie dalej na SE |
| Dz. 4/1 (dalej na S/SE) | 370,0 – 371,0 | Jeszcze wyżej |
| Dz. 2/2 (daleko na SE) | 371,8 – 372,2 | Najwyższe rzędne w okolicy |
| Dz. 25/18, 25/20 (daleko na E/SE) | 367,1 – 370,3 | Teren przy drodze obwodowej |

### 4.4 Analiza spadków:

| Kierunek | Różnica rzędnych | Odległość | Spadek |
|---|---|---|---|
| **W→E na działce** (366,2 → 369,2) | ~3,0 m | 43,72 m | **~6,9%** |
| **N→S na działce** (367,4 → 367,6...369,2) | ~1,8 m | 21,05 m | **~8,5%** |
| **NW→SE (najstromszy)** | ~3,0 m | ~48 m (diagonala) | **~6,3%** |
| **Skarpa na N** (4/5 → 4/3) | spadek ~2–3 m | ~20 m | **~10–15%** ⚠️ stroma |

### 4.5 Implikacje topograficzne:
- **Wjazd (W)** jest ~2 m poniżej ±0,00 → wejście główne wymaga rampy/schodów w górę
- **Ogród wschodni** jest na poziomie ±0,00 lub nieco wyżej → gładkie przejście salon↔taras
- **Na północ od działki jest SKARPA** (spadek 10–15%) → dz. 4/3/4/4 są niżej, las schodzi w dół
- **Na południe/SE teren rośnie dalej** → potencjalne "Ukryta Leśna Sauna" na wyższych rzędnych dz. sąsiednich
- **Woda deszczowa spływa z SE na NW** → drenaż potrzebny przy narożniku NW, nie NE!

---

## 5. USYTUOWANIE BUDYNKU

### 5.1 Bryła:
- **Kwadrat 12,50 × 12,50 m** (powierzchnia zabudowy: 156,25 m²)
- **2 kondygnacje nadziemne** (oznaczenie "(II)" na PZT)
- **Dach dwuspadowy**, kąt 42°

### 5.2 Odległości od granic:

| Strona | Odległość | Granica z | Uwagi |
|---|---|---|---|
| **ZACHÓD (droga)** | **9,80 m** | ul. Północna | Podjazd + garaż |
| **PÓŁNOC (dz. 4/4)** | **~3,00 m** | granica N | Pas wąski — tu biegną przyłącza |
| **POŁUDNIE (dz. 4/8)** | **7,21 m** | granica S | Taras południowy, słońce |
| **WSCHÓD (ogród)** | **18,58 m** | granica E (las) | Główny ogród kaskadowy |

### 5.3 Wskaźniki zagospodarowania:
- **Wskaźnik powierzchni zabudowy:** 156,25 / 920 = **~17%**
- **Szacunkowa pow. biologicznie czynna:** >60%

---

## 6. PRZYŁĄCZA I SIECI UZBROJENIA

### 6.1 Sieci biegnące wzdłuż/przez działkę (odczytane z PZT):

| Symbol | Kolor na PZT | Typ sieci | Przebieg | Uwagi |
|---|---|---|---|---|
| **S1** | Brązowy/bordowy | Kanalizacja sanitarna | Wzdłuż granicy PÓŁNOCNEJ, odcinek zachodni | Istniejąca sieć |
| **S2** | Brązowy/bordowy | Kanalizacja sanitarna | Wzdłuż granicy PÓŁNOCNEJ, odcinek wschodni | Istniejąca sieć |
| **ks1** | Brązowy/bordowy (przerywana) | Przyłącze kanalizacji | Od budynku na PÓŁNOC do S1 | Projektowane |
| **w** | Niebieski (jasny) | Wodociąg | Wzdłuż granicy PÓŁNOCNEJ, W→E | Istniejąca sieć |
| **e1** | Żółty/pomarańczowy | Energia elektryczna (przyłącze) | Od drogi (ZACHÓD) do budynku | Projektowane przyłącze |
| **eN** | Czerwony | Energia elektryczna (nowa linia) | Przy granicy zachodniej, wzdłuż drogi | Nowa linia zasilająca |
| **gw** | Żółty | Gaz (przyłącze) | Od drogi (ZACHÓD) do budynku | Projektowane |
| **k** | ? | Kabel telekomunikacyjny | Przy narożniku NE | |
| **ks** | Bordowy | Kanalizacja (dodatkowa) | Przy granicy NE | Oznaczenie na wschodnim krańcu |

### 6.2 Kierunki przyłączeń — podsumowanie:
- **Woda + kanalizacja:** z PÓŁNOCY — sieci biegną wzdłuż granicy N (między dz. 4/5 a 4/4)
- **Prąd + gaz:** z ZACHODU — z ul. Północnej
- **Telekomunikacja:** z PÓŁNOCNEGO-WSCHODU

### 6.3 Elementy infrastruktury przy granicy zachodniej (droga):
Na PZT oznaczone numerami:
- **3** — prawdopodobnie pojemniki na odpady (symbol kontenera/śmietnika)
- **4** — szafka przyłączeniowa (elektryczna lub gazowa) — symbol prostokąta z "X"
- **5** — szafka przyłączeniowa (druga) — przy granicy zachodniej

Wymiary pasa przy drodze: **3,00 + 5,00 m** = 8,00 m (podjazd dwuczęściowy — zawężenie + poszerzenie przy garażu)
Dodatkowe wymiary przy garażu: **4,15 m** (szerokość garażu?), **2,80 m** (głębokość?), **2,50 m** (?)

---

## 7. DANE PROJEKTOWE

### 7.1 Poziomy referencyjne:

| Punkt | Rzędna [m n.p.m.] | Różnica vs ±0,00 |
|---|---|---|
| Teren przy wjeździe (W) | ~367,4 | **−1,05 m** (poniżej parteru) |
| **±0,00 budynku** | **368,45** | **0,00** (referencja) |
| Teren przy ścianie E | ~368,5–369,0 | **+0,05 do +0,55 m** (na poziomie lub powyżej) |
| Ogród dalszy (E) | ~369,0–369,2 | **+0,55 do +0,75 m** |

### 7.2 Strefowanie budynku (wg koncepcji architektonicznej):

**PARTER:**
- **ZACHÓD** → Garaż dwustanowiskowy, wiatrołap, hol główny, kotłownia ("pancerz prywatności")
- **PÓŁNOC** → Biuro / sypialnia gościnna + łazienka gościnna
- **WSCHÓD** → Salon z przeszkleniem HST na las (~30 m²)
- **POŁUDNIE** → Kuchnia i jadalnia narożnikowa (~20-25 m²)
- **CENTRUM** → Schody (bufor akustyczny)

**PIĘTRO:**
- **WSCHÓD** → Master bedroom (poranne słońce, widok na las)
- **POŁUDNIE** → Pokoje dzieci (2 sypialnie)
- **ZACHÓD** → Pralnia/suszarnia (nad kotłownią — piony wod-kan), łazienka dzieci

### 7.3 Dach:
- Dwuspadowy, kąt nachylenia **42°**
- Kalenica orientacyjnie w osi **W–E**

---

## 8. MAPA RZĘDNYCH TERENU (ASCII)

Orientacja: N = góra, W = lewo

```
                    PÓŁNOC (dz. 4/4, niżej 366-367)
                    ↑
           NW ←─────┼─────→ NE
                    │
    367.4 ┌─────────┬────────────────────┐ 367.77
          │ PODJAZD │▓▓▓▓▓▓▓▓▓▓│        │
          │  9.80m  │▓ BUDYNEK ▓│ OGRÓD  │
    Z ──  │ droga   │▓ ±0.00=  ▓│ 18.58m │  ── E
    A     │ 366-367 │▓ 368.45  ▓│369.0   │     (las)
    C     │         │▓▓▓▓▓▓▓▓▓▓│        │
    H     │         │          │        │
          │         │  TARAS   │        │
    367.6 └─────────┴────────────────────┘ 369.2
                    │
                    ↓
                    POŁUDNIE (dz. 4/8, 368-369)
```

**Gradient kolorów rzędnych (niskie → wysokie):**
- 364-365: dz. 4/3 (N od 4/4) — skarpa, las
- 366-367: wjazd, droga, dz. 4/4
- 367-368: zachodnia część działki 4/5
- 368-369: budynek, wschodnia część działki
- 369-370: za granicą E działki
- 370-372: tereny dalej na SE (dz. 4/1, 2/2)

---

## 9. ZAGOSPODAROWANIE TERENU (PZT)

### 9.1 Elementy PZT:
| Nr na PZT | Element | Opis |
|---|---|---|
| **1** | Budynek mieszkalny | Bryła główna, II kondygnacje |
| **2** | Garaż / część gospodarcza | Przylegający od strony SW (szary na rysunku) |
| **3** | Pojemniki na odpady | Przy granicy zachodniej (droga) |
| **4** | Szafka przyłączeniowa | Przy granicy zachodniej |
| **5** | Szafka przyłączeniowa | Przy granicy zachodniej (najwyżej = najbliżej NW) |

### 9.2 Autor PZT:
- **Architekt:** Andrzej Bręnek
- **Pracownia:** PROCEL, Cieszyn
- **Data:** sierpień 2022
- **Skala:** 1:500 (PZT), 1:1000 (mapa sytuacyjna)

---

## 10. KONTEKST WIZUALNY (Street View, sie. 2012)

**Źródło:** Google Street View, ul. Północna, Cieszyn — sierpień 2012
**Link:** https://www.google.com/maps/place/Północna,+43-400+Cieszyn/@49.7731194,18.6442266,3a,37.5y,93.79h,83.96t/
**Heading kamery:** 93.79° (patrzy na WSCHÓD)

### Co widać:
- **Teren:** Otwarte pastwisko (PsIV), skoszona trawa — płaskie na pierwszym planie, delikatnie wznoszące się w głąb
- **Drzewa w tle (WSCHÓD):** Szpaler drzew na horyzoncie — to las, który będzie widokiem z salonu i master bedroom
- **Nachylenie:** Widoczne łagodne wzniesienie terenu od drogi (Z) w głąb (E) — potwierdzenie rzędnych z PZT
- **Charakter okolicy:** Otwarte tereny zielone, brak zabudowy w bezpośrednim sąsiedztwie — prywatność
- **Odległość do drzew:** Szacunkowo 60-80 m od drogi — działka ma 43,72 m, więc drzewa zaczynają się ~20-40 m za granicą wschodnią

### Wnioski dla projektu:
- **Las jest REALNY i BLISKI** — nie trzeba sadzić zieleni izolacyjnej na wschodzie, natura jest gotowa
- **Teren jest otwarty** — dom będzie dobrze doświetlony od S i E
- **Prywatność od drogi:** Po zabudowaniu działki, garaż + bryła domu skutecznie odetną widok z drogi
- **Wiatr:** Otwarte pastwisko = ekspozycja na wiatr z zachodu — potwierdza słuszność koncepcji "pancerza" zachodniego

### 10.2 Widok satelitarny (Google Maps, zdjęcie nowsze — po 2020)

**Link:** https://www.google.com/maps/place/Północna,+43-400+Cieszyn/@49.7731017,18.6447544,88m/data=!3m1!1e3

**Orientacja:** N = góra (standardowa orientacja Google Maps)

**Co widać — analiza sąsiedztwa:**
- **Dom sąsiada z PÓŁNOCY** (oznaczenie 48R na mapie): Nowy budynek z ciemnym dachem (dwuspadowy), podjazd z dwoma samochodami. Zbudowany po 2012 (brak go na Street View z 2012). Stoi na działce sąsiedniej, prawdopodobnie dz. 4/4 lub fragment przy ul. Północnej.
- **Dom na POŁUDNIU** (lewy dolny róg zdjęcia): Kolejny nowy dom z ciemnym dachem — prawdopodobnie na dz. 4/8 lub sąsiedniej.
- **Droga dojazdowa (ul. Północna):** Widoczna po LEWEJ stronie zdjęcia (ZACHÓD) — szara, nieutwardzona/gruntowa, ślepa.
- **Droga/dojazd sąsiada:** Odcinek od ul. Północnej na WSCHÓD do domu 48R — przebiega wzdłuż PÓŁNOCNEJ granicy dz. 4/5.

**Identyfikacja działki 4/5:**
- Na działce stoi **mały drewniany domek** (widoczny w centralnej/zachodniej części zaznaczonego obszaru) — istniejący obiekt, punkt referencyjny
- Działka to duży prostokąt zielonego pastwiska, rozciągający się od drogi (ZACHÓD) w głąb terenu (WSCHÓD)
- Wschodnia granica: przechodzi w gęstsze zarośla/krzewy/drzewa — naturalny bufor roślinny, początek strefy leśnej
- Teren wokół domku: trawa nieskoszona, zarośla — teren nieużytkowany/pastwisko

**Obserwacje topograficzne z satelity:**
- Kolor trawy ciemniejszy w niższych partiach (zachód/NW) — więcej wilgoci
- Kolor trawy jaśniejszy w wyższych partiach (SE) — bardziej suchy, wyżej
- Widoczne koleiny/ślady koszenia tworzące łuki — potwierdzenie nachylenia terenu
- Ciemniejsze plamy przy narożniku NW: możliwe podmakanie — potwierdza potrzebę drenażu w tym miejscu

**Nowe sąsiedztwo vs koncepcja 2022:**
Dom sąsiada 48R (na N) zmienia kontekst widokowy od strony północnej — biuro/sypialnia gościnna na parterze będą miały widok częściowo na ten dom, nie tylko na las. Warto uwzględnić to w projekcie zieleni izolacyjnej od północy.

---

## 11. DO POZYSKANIA / WERYFIKACJI

| Dokument | Status | Priorytet |
|---|---|---|
| **Wypis i wyrys z MPZP** (parametry 67MN) | ❌ brak | KRYTYCZNY — potrzebne max. zabudowa, wysokość, PBC, dach |
| **Mapa do celów projektowych** | ❓ może istnieje | WYSOKI — aktualne rzędne, granice, uzbrojenie od geodety |
| **Badania geotechniczne** | ❌ brak | WYSOKI — warunki gruntowe, poziom wód, skarpa na N |
| **Warunki przyłączeniowe** | ❓ | ŚREDNI — prąd (Tauron), gaz (PSG), woda/kan (ZW Cieszyn) |
| **Zdjęcia z drona / ortofotomapa** | ✅ Google Maps satelita | POMOCNICZY — widoczny domek drewniany na działce, sąsiedztwo |

---

## 12. INSTRUKCJA DLA LLM

### Priorytet wiarygodności danych:
1. **PEWNE** — Wymiary działki 43,72 × 21,05 m (z PZT, zwymiarowane)
2. **PEWNE** — Wymiary budynku 12,50 × 12,50 m (z koncepcji)
3. **PEWNE** — Poziom ±0,00 = 368,45 m n.p.m. (z PZT)
4. **PEWNE** — Odległości budynku od granic (z PZT, zwymiarowane)
5. **PRZYBLIŻONE ±0,3 m** — Rzędne terenu (odczytane z mapy)
6. **DO WERYFIKACJI** — Parametry MPZP (wymaga wypisu z uchwały)

### Kluczowe ostrzeżenie:
Rzędne z pliku "Komplet" (do 372,6 m) dotyczą terenu dalej na SE/S za granicami działki 4/5, nie samej działki.

### Orientacja — jak rozmawiać o projekcie:
- "Od strony drogi" = ZACHÓD
- "Od strony lasu/ogrodu" = WSCHÓD  
- "Sąsiad po lewej od wjazdu" = PÓŁNOC (dz. 4/4, teren niżej — skarpa)
- "Sąsiad po prawej od wjazdu" = POŁUDNIE (dz. 4/8)
