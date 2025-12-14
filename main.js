/**
 * @fileoverview
 * Aplikace pro generování zaměstnanců a výpočet základních statistik.
 */

/**
 * Vstupní konfigurační objekt aplikace.
 * @typedef {Object} DtoIn
 * @property {number} count Počet generovaných zaměstnanců.
 * @property {Object} age Věkové omezení zaměstnanců.
 * @property {number} age.min Minimální věk zaměstnance.
 * @property {number} age.max Maximální věk zaměstnance.
 */

/**
 * Objekt reprezentující jednoho zaměstnance.
 * @typedef {Object} Employee
 * @property {"male"|"female"} gender Pohlaví zaměstnance.
 * @property {string} name Křestní jméno zaměstnance.
 * @property {string} surname Příjmení zaměstnance.
 * @property {string} birthdate Datum narození ve formátu ISO string.
 * @property {number} workload Pracovní úvazek v hodinách (10, 20, 30, 40).
 */

const dtoIn = {
  count: 50,
  age: { min: 19, max: 35 }
};

const czechNames = {
  male: {
    firstNames: ["Jan","Tomáš","Petr","Jakub","Lukáš","Martin","Michal","David","Pavel","Josef","Vojtěch","Marek","Daniel","Adam","Ondřej","Matěj","Jiří","Radek","Karel","Aleš","Roman","Libor","Štěpán","Richard","Dominik"],
    lastNames: ["Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec","Pokorný","Marek","Král","Bartoš","Janda","Fiala","Kadlec","Vacek","Blažek","Holub","Šimek","Hruška","Kolář","Urban","Richter"]
  },
  female: {
    firstNames: ["Jana","Petra","Lucie","Eva","Martina","Kateřina","Michaela","Veronika","Monika","Tereza","Anna","Alena","Barbora","Kristýna","Helena","Nikola","Gabriela","Lenka","Markéta","Pavla","Radka","Eliška","Marie","Simona","Denisa"],
    lastNames: ["Nováková","Svobodová","Novotná","Dvořáková","Černá","Procházková","Kučerová","Veselá","Horáková","Němcová","Pokorná","Marková","Králová","Bartošová","Jandová","Fialová","Kadlecová","Vacková","Blažková","Holubová","Šimková","Hrušková","Kolářová","Urbanová","Richterová"]
  }
};

/**
 * Vygeneruje pole zaměstnanců s náhodnými daty podle vstupní konfigurace.
 * Jména jsou vybírána z předdefinovaného seznamu českých jmen podle pohlaví.
 * Datum narození je generováno tak, aby odpovídalo zadanému věkovému rozmezí.
 *
 * @param {DtoIn} dtoIn Vstupní objekt s počtem zaměstnanců a věkovým rozmezím.
 * @returns {Employee[]} Pole vygenerovaných zaměstnanců.
 */
export function generateEmployeeData(dtoIn) {
  const employees = [];
  const genders = ['male','female'];
  const workloads = [10,20,30,40];

  for (let i = 0; i < dtoIn.count; i++) {
    const gender = genders[Math.floor(Math.random()*genders.length)];
    const firstNames = czechNames[gender].firstNames;
    const lastNames = czechNames[gender].lastNames;

    const name = firstNames[Math.floor(Math.random()*firstNames.length)];
    const surname = lastNames[Math.floor(Math.random()*lastNames.length)];
    const workload = workloads[Math.floor(Math.random()*workloads.length)];

    const start = new Date(new Date().getFullYear() - dtoIn.age.max,10,25).getTime();
    const end = new Date(new Date().getFullYear() - dtoIn.age.min,10,25).getTime();
    const birthdate = new Date(start + Math.random()*(end-start)).toISOString();

    employees.push({ gender, name, surname, birthdate, workload });
  }
  return employees;
}

/**
 * Vypočítá statistiky nad seznamem zaměstnanců.
 * Zahrnuje věkové statistiky, rozložení úvazků, medián úvazku a průměrný úvazek žen.
 *
 * @param {Employee[]} empData Pole zaměstnanců.
 * @returns {Object} Objekt obsahující statistiky.
 * @returns {number} total Celkový počet zaměstnanců.
 * @returns {number} workload10 Počet zaměstnanců s úvazkem 10 hodin.
 * @returns {number} workload20 Počet zaměstnanců s úvazkem 20 hodin.
 * @returns {number} workload30 Počet zaměstnanců s úvazkem 30 hodin.
 * @returns {number} workload40 Počet zaměstnanců s úvazkem 40 hodin.
 * @returns {number} averageAge Průměrný věk zaměstnanců.
 * @returns {number} minAge Minimální věk zaměstnance.
 * @returns {number} maxAge Maximální věk zaměstnance.
 * @returns {number} medianAge Medián věku zaměstnanců.
 * @returns {number} medianWorkload Medián pracovního úvazku.
 * @returns {number} averageWomenWorkload Průměrný úvazek žen.
 * @returns {Employee[]} sortedByWorkload Pole zaměstnanců seřazené podle úvazku.
 */
export function getEmployeeStatistics(empData) {
  const now = new Date();
  const ages = empData.map(emp => (now - new Date(emp.birthdate))/(1000*60*60*24*365.25));

  const averageAge = Number((ages.reduce((a,b)=>a+b,0)/ages.length).toFixed(1));
  const sortedAges = [...ages].sort((a,b)=>a-b);
  const medianAge = Math.trunc(sortedAges.length % 2 === 0 ?
    (sortedAges[sortedAges.length/2-1] + sortedAges[sortedAges.length/2])/2 :
    sortedAges[Math.floor(sortedAges.length/2)]);

  let load10=0, load20=0, load30=0, load40=0, totalFemaleLoad=0, femaleCount=0;

  for (const emp of empData) {
    switch(emp.workload){
      case 10: load10++; break;
      case 20: load20++; break;
      case 30: load30++; break;
      case 40: load40++; break;
    }
    if(emp.gender==='female'){ totalFemaleLoad += emp.workload; femaleCount++; }
  }

  const averageWomenWorkload = Number((totalFemaleLoad/femaleCount).toFixed(1));
  const sortedByWorkload = [...empData].sort((a,b)=>a.workload-b.workload);
  const medianWorkload = Math.trunc(sortedByWorkload.length % 2 === 0 ?
    (sortedByWorkload[sortedByWorkload.length/2-1].workload + sortedByWorkload[sortedByWorkload.length/2].workload)/2 :
    sortedByWorkload[Math.floor(sortedByWorkload.length/2)].workload);

  return {
    total: empData.length,
    workload10: load10,
    workload20: load20,
    workload30: load30,
    workload40: load40,
    averageAge,
    minAge: Math.trunc(Math.min(...ages)),
    maxAge: Math.trunc(Math.max(...ages)),
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload
  };
}

/**
 * Hlavní funkce aplikace.
 * Slouží jako vstupní bod – generuje zaměstnance a vypočítá jejich statistiky.
 *
 * @param {DtoIn} dtoIn Vstupní konfigurační objekt.
 * @returns {Object} Výsledné statistiky zaměstnanců.
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

console.log(main(dtoIn));
