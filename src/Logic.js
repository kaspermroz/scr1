const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

// hyperperiod
// liczy hyperperiod dla obecnej listy zadan.
const calcHyperPeriod = (zadania) => {
  return zadania.map(zadanie => zadanie.okres).reduce(lcm);
}

// zwraca index zadania ktore ma priorytet w obecej jednosce czasu
const estimatePriority = (zadaniaCzasuRzeczywistego, zadania) => {
  // hyperperiod tu powinnen byc ze zmiennej wyciagany ale react sie nie slucha.
  let tempPeriod = calcHyperPeriod(zadania)
  let p = -1

  zadaniaCzasuRzeczywistego.forEach(({ okres, czasWykonania }, i) => {
    if (czasWykonania !== 0) {
      if (tempPeriod > okres) {
        tempPeriod = okres
        p = i
      }
    }
  })

  return p
}

export const warunkiSzeregowalnosci = (zadania) => {
  // obliczanie U
  let czy_jest_szeregowalny = false;
  const U = zadania
    .map((zadanie) => zadanie.czasWykonania / zadanie.okres)
    .reduce((suma, i) => suma + i, 0);

  let warunek_dostateczny;
  if (U <= 1) {
    // Twierdzenie o kresie algorytmu
    warunek_dostateczny =
      zadania.length * (Math.pow(2, 1 / zadania.length) - 1);
    if (U <= warunek_dostateczny) {
      czy_jest_szeregowalny = true;
      console.log("Mozna zaszeregowac RMS");
    } else {
      console.log("Nie mozna zaszeregowac RMS");
    }
  } else {
    console.log("U > 1!");
  }

  return { U, warunek_dostateczny, czy_jest_szeregowalny };
};

export const uszereguj = (zadania) => {
  let zadaniaCzasuRzeczywistego = JSON.parse(JSON.stringify(zadania));
  const timeline = []; // {jednostkaCzasu: number, nazwaZadania: string}
  [...Array(calcHyperPeriod(zadania)).keys()].forEach(t => {
    const indexZadania = estimatePriority(zadaniaCzasuRzeczywistego, zadania);

    if (indexZadania !== -1) {
      // wykonuje sie task
      console.log(`t${t} -->t${t+1}: TASK ${zadania[indexZadania].nazwa}`);
      timeline.push({jednostkaCzasu: t, nazwaZadania: zadania[indexZadania].nazwa})
      zadaniaCzasuRzeczywistego[indexZadania].czasWykonania -= 1
    } else {
      // nic sie nie dzieje
      timeline.push({jednostkaCzasu: t, nazwaZadania: 'IDLE'})
      console.log(`t${t} -->t${t+1}: IDLE`);
    }

    // Update Period after each clock cycle
    zadaniaCzasuRzeczywistego = zadaniaCzasuRzeczywistego.map(zadanieCzasuRzeczywistego => {
      zadanieCzasuRzeczywistego.okres -= 1;
      if (zadanieCzasuRzeczywistego.okres === 0) {
        let index = zadania.findIndex(it => zadanieCzasuRzeczywistego.nazwa === it.nazwa);
        zadanieCzasuRzeczywistego = JSON.parse(JSON.stringify(zadania[index]));
      }
      return zadanieCzasuRzeczywistego;
    })
  })

  return timeline;
};
