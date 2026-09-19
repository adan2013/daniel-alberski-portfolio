## Po co wracać do narzędzia z 2019 roku?

Pierwszy Gauge Generator napisałem w C# jako desktopowe narzędzie do projektowania tarcz zegarów. Chciałem przenieść je do przeglądarki: bez instalacji, z wygodniejszym interfejsem i większą swobodą pracy z plikami. To była też okazja, żeby wykorzystać sposób pracy z AI wypracowany wcześniej przy trzech projektach komercyjnych.

## Małe etapy, konkretna definicja ukończenia

Nie sprowadzałem migracji do polecenia „przepisz aplikację”. Czytałem kod pierwszej wersji i na jego podstawie przygotowywałem szczegółowe specyfikacje funkcji. Plan podzieliłem na małe etapy. Każdy miał osobną definicję ukończenia, dzięki czemu mogłem sprawdzać działanie kolejnych elementów i nie przeciążać okna kontekstowego AI.

Między etapami sam robiłem code review. Sprawdzałem architekturę i zgodność kodu ze swoim zamysłem, a wnioski uwzględniałem w specyfikacjach następnych etapów. AI uczestniczyło w całym procesie wytwarzania; kierunek, podział pracy i kontrola rozwiązania pozostawały po mojej stronie.

## Edytor zbudowany wokół pracy z tarczą

Interfejs w React zastąpił przestarzały interfejs desktopowy. Dodałem elementy interaktywne i undo/redo. Warstwy oraz podgląd na żywo pomagają pracować nad kompozycją i od razu zobaczyć efekt zmian.

[media:1]

## Rezultat: przeglądarka i otwarty format

Aplikacja działa bez instalacji i korzysta z otwartego formatu danych. Pierwsza wersja eksportowała tylko PNG; nowa pozwala zapisać tarczę także jako SVG i PDF. Działający edytor i jego dokumentacja są dostępne publicznie.

Najważniejszą zmianą jest dla mnie przeniesienie własnego, istniejącego narzędzia do środowiska, w którym łatwiej je uruchomić i dalej rozwijać. AI pomogło wykonać tę pracę, a szczegółowa specyfikacja i własne review pozwalały mi kontrolować rezultat.
