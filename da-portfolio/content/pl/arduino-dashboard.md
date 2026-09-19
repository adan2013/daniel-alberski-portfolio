## Fizyczne zegary do symulatora

Chciałem zbudować zestaw fizycznych zegarów samochodowych do Euro Truck Simulator 2 i American Truck Simulator. Były to moje pierwsze kroki w elektronice. Zanim zabrałem się za wykonanie, spędziłem miesiące na samodzielnym researchu i nauce, bez wsparcia AI.

To mój najbardziej dopracowany projekt hardware’owy. Przygotowałem elektronikę i ręcznie wykonane tarcze, interpreter telemetrii oraz generator tarcz w C#/WPF, a także oprogramowanie Arduino w C++.

## Ograniczenia Arduino i magistrali SPI

Wyświetlanie danych wymagało uwzględnienia ograniczonej przepustowości Arduino i magistrali SPI wyświetlacza. Samo narysowanie interfejsu nie wystarczało — sposób odświeżania miał wpływ na działanie całości.

Optymalizowałem wyświetlanie, odświeżając obraz segmentami. Interfejs zbudowałem z podstawowych prymitywów zamiast rozbudowanej biblioteki GUI. Te decyzje wynikały z możliwości sprzętu, na którym program miał działać.

[media:1]

## Własne wykonanie, od tarczy po kod

Całość powstała metodami DIY, bez druku 3D i innych zaawansowanych metod wytwarzania. Ręczne wykonanie tarcz było częścią tej samej pracy co elektronika i programowanie. Musiałem doprowadzić do współpracy dane z gry, własne oprogramowanie oraz fizyczne zegary.

[video]

## Rezultat i materiały

Powstał kompletny zestaw zegarów do symulatorów. Film pokazuje działanie urządzenia, a dokumentacja na Redarku opisuje budowę. Udostępniłem również repozytorium projektu. To zapis nauki elektroniki przez stworzenie konkretnego, rozbudowanego urządzenia.
