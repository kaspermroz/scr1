import {useEffect, useState} from "react";


const Logic = () => {
    const [zadania, setZadania] = useState([
        {nazwa: 'P1', okres: 5, czasWykonania: 2},
        {nazwa: 'P2', okres: 10, czasWykonania: 2},
        {nazwa: 'P3', okres: 20, czasWykonania: 3},
    ]); // {nazwa: string, priorytet: number, okres: number, czasWykonania: number}
    const [hyperPeriod, setHyperPeriod] = useState(undefined);
    const [U, setU] = useState(undefined);
    const [uUtil, setUUtil] = useState(undefined);

    useEffect(() => {
        uszereguj();
    },[]);

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


    const gcd = (a, b) => a ? gcd(b % a, a) : b;
    const lcm = (a, b) => a * b / gcd(a, b);

    // hyperperiod
    // liczy hyperperiod dla obecnej listy zadan.
    const calcHyperPeriod = () => {
        return zadania.map(zadanie => zadanie.okres).reduce(lcm);
    }

    // zwraca index zadania ktore ma priorytet w obecej jednosce czasu
    const estimatePriority = (zadaniaCzasuRzeczywistego) => {
        // hyperperiod tu powinnen byc ze zmiennej wyciagany ale react sie nie slucha.
        let tempPeriod = calcHyperPeriod()
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

    const uszereguj = () => {
        let zadaniaCzasuRzeczywistego = JSON.parse(JSON.stringify(zadania));
        const timeline = []; // {jednostkaCzasu: number, nazwaZadania: string}
        [...Array(calcHyperPeriod()).keys()].forEach(t => {

            const indexZadania = estimatePriority(zadaniaCzasuRzeczywistego);

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
        console.log(timeline);
    }

    return (<div>haha</div>)
}

export default Logic;
