import {useState} from "react";



const Logic = () => {
    const [zadania, setZadania] = useState([]); // {priorytet: number, okres: number, czasWykonania: number}
    const [hyperPeriod, setHyperPeriod] = useState(undefined);
    const [U, setU] = useState(undefined);
    const [uUtil, setUUtil] = useState(undefined);

    // sprawdzenie czy dany zestaw zadan da sie zaszeregować
    const warunkiSzeregowalnosci = () => {
        // obliczanie U
        const U = zadania
            .map(zadanie => Math.floor(zadanie.czasWykonania / zadanie.okres))
            .reduce((suma, i) => suma + i, 0);

        setU(U);

        if (U <= 1) {
            // Twierdzenie o kresie algorytmu
            const sched_util = zadania.length*(Math.pow(2, 1/zadania.length)-1);
            setUUtil(sched_util);
            if (U <= sched_util) {
                console.log("Mozna zaszeregowac RMS")
            } else {
                console.log("Nie mozna zaszeregowac RMS")
            }
        } else {
            console.log("U > 1!");
        }
    }

    // hyperperiod
    // liczy hyperperiod dla obecnej listy zadan.
    const calcHyperPeriod = () => {
        // Function to return gcd of a and b
        function NWD(a, b) {
            if (a == 0)
                return b;
            return gcd(b % a, a);
        }

        let wynik = zadania[0].okres;
        for (let i = 1; i < zadania.length; i++) {
            wynik = NWD(zadania[i].okres, wynik);

            if (wynik == 1) {
                return 1;
            }
        }

        setHyperPeriod(wynik);
    }

    const estimatePriority = () => {
        let tempPeriod = hyperPeriod
        let p = -1

        zadania.forEach(({ okres, czasWykonania }, i) => {
            if (czasWykonania !== 0) {
                if (tempPeriod > okres) {
                    tempPeriod = okres
                    p = i
                }
            }
        })

        return p
    }
}

export default Logic;
