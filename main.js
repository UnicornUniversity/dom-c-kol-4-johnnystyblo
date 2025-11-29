//TODO add imports if needed
//TODO doc
/**
 * The main function which calls the application. 
 * Please, add specific description here for the application purpose.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
const dtoIn = {
  count: 50,
  age: {
    min: 19,
    max: 35
  } // počet a věk zaměstnanců
};
const czechNames = {
  male: {
    firstNames: [
      "Jan","Tomáš","Petr","Jakub","Lukáš","Martin","Michal","David","Pavel","Josef",
      "Vojtěch","Marek","Daniel","Adam","Ondřej","Matěj","Jiří","Radek","Karel","Aleš",
      "Roman","Libor","Štěpán","Richard","Dominik"
    ],
    lastNames: [
      "Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec",
      "Pokorný","Marek","Král","Bartoš","Janda","Fiala","Kadlec","Vacek","Blažek","Holub",
      "Šimek","Hruška","Kolář","Urban","Richter"
    ]
  },
  female: {
    firstNames: [
      "Jana","Petra","Lucie","Eva","Martina","Kateřina","Michaela","Veronika","Monika","Tereza",
      "Anna","Alena","Barbora","Kristýna","Helena","Nikola","Gabriela","Lenka","Markéta","Pavla",
      "Radka","Eliška","Marie","Simona","Denisa"
    ],
    lastNames: [
      "Nováková","Svobodová","Novotná","Dvořáková","Černá","Procházková","Kučerová","Veselá","Horáková","Němcová",
      "Pokorná","Marková","Králová","Bartošová","Jandová","Fialová","Kadlecová","Vacková","Blažková","Holubová",
      "Šimková","Hrušková","Kolářová","Urbanová","Richterová"
    ]
  }
}; // importování jmen

export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const dtoOut = getEmployeeStatistics(employees);
  
  return dtoOut;
}

export function generateEmployeeData(dtoIn) {
  const dtoOut = [];
  const genders = ['male','female'];
  const workloads = [10,20,30,40]; // možné úvazky

  for (let i = 0; i < dtoIn.count; i++) {
    const gender = genders[~~(Math.random()*2)]; // náhodné pohlaví
    const firstNames = czechNames[gender].firstNames; // appendování jmen podle pohlaví
    const lastNames = czechNames[gender].lastNames;

    const name = firstNames[~~(Math.random()*firstNames.length)]; // výběr jména
    const surname = lastNames[~~(Math.random()*lastNames.length)];
    const workload = workloads[~~(Math.random()*workloads.length)]; // výběr úvazku
    const age = parseInt(~~(Math.random() * (dtoIn.age.max - dtoIn.age.min + 1)) + dtoIn.age.min);// náhodný věk v rozmezí

    // náhodné datum narození
    const start = new Date(new Date().getFullYear() - dtoIn.age.max,10,25).getTime();
    const end = new Date(new Date().getFullYear() - dtoIn.age.min,10,25).getTime();
    const birthdate = new Date(start + Math.random()*(end-start)).toISOString();

    dtoOut.push({ gender, birthdate, age, name, surname, workload }); // vznik zaměstnance
  }
  return dtoOut;
}
export function getEmployeeStatistics(employees) {
  const empData = generateEmployeeData(dtoIn);
  let load10 = 0;
  let load20 = 0;
  let load30 = 0;
  let load40 = 0;
  let avgAge = 0;
  let totalAge = 0;
  let totalFemLoad = 0;
  let avgFemLoad = 0;
  let medianAge = 0;
  let medianWorkload = 0;
  const ageListSort = [...empData].sort((a,b) => a.age - b.age);
  const loadListSort = [...empData].sort((a,b) => a.workload - b.workload);
  avgFemLoad = (totalFemLoad / empData.filter(emp => emp.gender === 'female').length).toFixed(1);
  avgAge = (totalAge / empData.length).toFixed(1);
  for (let i = 0; i < empData.length; i++) {
    totalAge+=empData[i].age;
    switch (empData[i].workload) {
      case 10:  load10++; break;
      case 20:  load20++; break;
      case 30:  load30++; break;
      case 40:  load40++; break;
    }
    if (empData[i].gender === 'female') {
      totalFemLoad += empData[i].workload;
    }
  }
  if (empData.length %2 === 0) {
    medianWorkload = ((loadListSort[Math.floor(loadListSort.length/2)].workload + loadListSort[Math.floor(loadListSort.length/2) -1].workload) / 2).toFixed(0); ;
    medianAge = ((ageListSort[Math.floor(ageListSort.length/2)].age + ageListSort[Math.floor(ageListSort.length/2) -1].age) / 2).toFixed(0); ;
  } else {
    medianWorkload = (loadListSort[(Math.floor(loadListSort.length/2))].workload).toFixed(0);
    medianAge = (ageListSort[(Math.floor(ageListSort.length/2))].age).toFixed(0);
  }
  const dtoOut = {
    total: empData.length,
    workload10: load10,
    workload20: load20,
    workload30: load30,
    workload40: load40,
    averageAge: avgAge,
    minAge: dtoIn.age.min,
    maxAge: dtoIn.age.max,
    medianAge: medianAge,
    medianWorkload: medianWorkload,
    averageWomenWorkload: avgFemLoad,
    sortedByWorkload: loadListSort,

  };
  return dtoOut;
};
