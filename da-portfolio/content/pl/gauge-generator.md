## Narzędzie zbudowane do fizycznych zegarów

Pierwszy Gauge Generator powstał w 2019 roku na potrzeby [DIY Arduino Dashboard](/projects/arduino-dashboard). Budowałem wtedy fizyczny zestaw zegarów do Euro Truck Simulatora i potrzebowałem własnych tarcz: z innymi skalami, kontrolkami i oznaczeniami niż w liczniku samochodowym, który służył mi za bazę. Rysowanie każdego wariantu ręcznie szybko przestało mieć sens, więc napisałem w C# desktopowe narzędzie do generowania takich grafik.

Program pozwalał składać tarczę z warstw, ustawiać skale i eksportować gotowy obraz do PNG. Zrobiłem go dla konkretnego projektu, ale udostępniłem kod i dokumentację. Po kilku latach znalazłem w internecie odwołania osób, które używały aplikacji do własnych zegarów i skal. Pomysł okazał się przydatny również poza moim warsztatem.

[media:2]

## Powrót po siedmiu latach

W 2026 roku wróciłem do Gauge Generatora, szukając niewielkiego projektu, na którym mogłem sprawdzić swój sposób programowania z AI poza dużymi systemami komercyjnymi. Znałem domenę, miałem działającą wersję odniesienia i mogłem łatwo ocenić, czy nowe rozwiązanie rzeczywiście robi to, czego oczekuję.

Nie przenosiłem starego kodu ani modelu danych. Zachowałem pomysł i zasady działania, a aplikację zbudowałem od początku jako edytor przeglądarkowy. Całość zajęła równy tydzień pracy po godzinach. W tym czasie powstały edytor, landing page, dokumentacja, przykładowe projekty oraz filmy pokazujące ich budowę.

Żeby zmieścić ten zakres w tygodniu, wspólnie z AI przygotowywałem specyfikację na podstawie zachowania starej aplikacji, a potem dzieliłem ją na małe etapy z osobną definicją ukończenia. Po każdym etapie uruchamiałem projekt, sprawdzałem rezultat i robiłem code review. Dopiero wtedy poprawiałem plan kolejnej części.

## AI przyspieszało pracę, ale nie wybierało kierunku

Stara aplikacja była użytecznym punktem odniesienia, lecz jej semantyka nie zawsze pasowała do nowego rozwiązania. AI miało tendencję do zachowywania dawnych podziałów albo dokładania abstrakcji tam, gdzie prostszy model lepiej pasował do edytora działającego w przeglądarce. Musiałem stale sprawdzać nie tylko poprawność kodu, ale też kierunek rozwoju architektury.

Problem ujawnił się w systemie walidacji. Jedna z pierwszych implementacji rozdzielała reguły między kilka etapów i uruchamiała je po każdym naciśnięciu klawisza. Formularz odrzucał przez to wiele przejściowych stanów, które pojawiają się podczas wpisywania prawidłowej wartości. Użytkownik nie mógł spokojnie dokończyć danych, ponieważ aplikacja próbowała ocenić niepełny zapis.

Sprowadziłem kontrolę walidacji do jednego miejsca i przesunąłem ją na moment, w którym pełna wartość jest już dostępna. Wygenerowany kod traktowałem jako propozycję. Specyfikacja i review pozwalały szybko rozwijać aplikację bez oddawania kontroli nad jej zachowaniem.

## Matematyka ukryta pod tarczą

Najwięcej pracy koncepcyjnej wymagało mapowanie wartości. Prosta skala liniowa rozkłada kolejne wartości w równych odstępach, ale nie każdy instrument działa w ten sposób. W wersji 2.0 dodałem skalę logarytmiczną oraz własne mapowanie oparte na wieloodcinkowej krzywej.

Edytor własnej krzywej działa podobnie do ustawiania krzywej wentylatorów w BIOS-ie. Użytkownik dzieli i łączy odcinki, określając, jak kolejne części zakresu mają zajmować miejsce na tarczy. Może przeznaczyć więcej przestrzeni na interesujący go fragment skali, a mniej na wartości, które nie wymagają takiej dokładności. To mapowanie staje się wspólną podstawą dla kresek, liczb, łuków, etykiet i wskazówki, dzięki czemu wszystkie elementy pozostają ze sobą wyrównane.

Poprawność obliczeń sprawdzałem ręcznie oraz testami jednostkowymi znajdującymi się w repozytorium. Ręczne próby pomagały ocenić zachowanie edytora i wygląd skali, a testy zabezpieczały przeliczenia oraz przypadki brzegowe. Przy tej funkcji sam podgląd „na oko” nie wystarczał: niewielki błąd w mapowaniu rozchodził się na każdą warstwę korzystającą z danego zakresu.

## Edycja bezpośrednio na podglądzie

Nowy interfejs w React dzieli pracę na zakresy i warstwy wizualne. Zakres opisuje geometrię oraz sposób przeliczania wartości, ale sam nie jest widoczny na gotowej grafice. Warstwy korzystają z niego jako ze wspólnego układu odniesienia. Dostępne są między innymi skale kreskowe i numeryczne, łuki, etykiety, wskazówki, figury, linie oraz ikony.

[media:1]

Właściwości można zmieniać w panelu, ale wiele elementów ma też uchwyty bezpośrednio na podglądzie. Przeciągnięcie uchwytu i zmiana odpowiadającego mu pola edytują te same dane. Efekt pojawia się od razu na dopasowanym do okna obszarze roboczym. Przy bardziej rozbudowanych projektach można ukrywać, powielać i przestawiać warstwy, czasowo izolować wybrany element oraz cofać i ponawiać zmiany.

[media:3]

Edytor pracuje w fizycznych wymiarach podawanych w milimetrach, co ma znaczenie przy projektowaniu tarczy przeznaczonej do druku. Gotową pracę można wyeksportować do PNG, SVG albo PDF. SVG zachowuje wektorową postać grafiki, a PDF pozwala przygotować wydruk całego projektu lub poszczególnych warstw.

## Bez konta i zamkniętego formatu

Aplikacja działa w całości w przeglądarce i nie wymaga rejestracji. Projekty oraz automatyczne kopie pozostają lokalnie zamiast trafiać do usługi chmurowej. Edytowalny plik projektu jest czytelnym dokumentem JSON, który można pobrać, przechowywać i później ponownie otworzyć.

Gauge Generator 2.0 traktuję jako zakończony eksperyment. W ciągu tygodnia sprawdziłem na własnym projekcie proces oparty na wspólnie tworzonej specyfikacji, krótkich etapach i regularnym review. Powstało przy tym publiczne narzędzie, którego można używać bez instalacji i opłat. Nie planuję teraz kolejnego dużego etapu rozwoju, ale kod pozostaje otwarty na poprawki i kontrybucje.
