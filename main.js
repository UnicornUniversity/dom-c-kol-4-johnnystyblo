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

export function generateEmployeeData(dtoIn) {
  const employees = [];
  const genders = ['male','female'];
  const workloads = [10,20,30,40]; // možné úvazky

  for (let i = 0; i < dtoIn.count; i++) {
    const gender = genders[~~(Math.random()*2)]; // náhodné pohlaví
    const firstNames = czechNames[gender].firstNames; // appendování jmen podle pohlaví
    const lastNames = czechNames[gender].lastNames;

    const name = firstNames[~~(Math.random()*firstNames.length)]; // výběr jména
    const surname = lastNames[~~(Math.random()*lastNames.length)];
    const workload = workloads[~~(Math.random()*workloads.length)]; // výběr úvazku

    // náhodné datum narození
    const start = new Date(new Date().getFullYear() - dtoIn.age.max,10,25).getTime();
    const end = new Date(new Date().getFullYear() - dtoIn.age.min,10,25).getTime();
    const birthdate = new Date(start + Math.random()*(end-start)).toISOString();

    employees.push({ gender, birthdate, name, surname, workload }); // vznik zaměstnance
  }
  return employees;
}
export function getEmployeeStatistics(empData) {
  const now = new Date();

  const ages = empData.map(emp =>
  (now - new Date(emp.birthdate)) / (1000*60*60*24*365.25)
);
  const avgAge = Number((ages.reduce((a,b)=>a+b,0)/ages.length).toFixed(1));
  const ageListSort = [...ages].sort((a,b)=>a-b);
  const medianAge = ageListSort.length % 2 === 0
  ? Number(Math.trunc(
      (ageListSort[ageListSort.length/2 - 1] +
       ageListSort[ageListSort.length/2]) / 2
    ))
  : Number(Math.trunc(ageListSort[Math.floor(ageListSort.length/2)]));

  let load10=0, load20=0, load30=0, load40=0, totalFemLoad=0;

  for (const emp of empData) {
    switch(emp.workload){
      case 10: load10++; break;
      case 20: load20++; break;
      case 30: load30++; break;
      case 40: load40++; break;
    }
    if(emp.gender==='female') totalFemLoad += emp.workload;
  }

  const avgFemLoad = Number((totalFemLoad / empData.filter(e => e.gender==='female').length).toFixed(1));

  const sortedByWorkload = [...empData].sort((a,b)=>a.workload-b.workload);

  // median workload přímo ze seřazeného pole
  const medianWorkload = sortedByWorkload.length % 2 === 0
  ? Number(Math.trunc(
      (sortedByWorkload[sortedByWorkload.length/2 - 1].workload +
       sortedByWorkload[sortedByWorkload.length/2].workload) / 2
    ))
  : Number(sortedByWorkload[Math.floor(sortedByWorkload.length/2)].workload);
  const minAge = Math.trunc(Math.min(...ages));
  const maxAge = Math.trunc(Math.max(...ages));

  return {
    total: empData.length,
    workload10: load10,
    workload20: load20,
    workload30: load30,
    workload40: load40,
    averageAge: avgAge,
    minAge: minAge,
    maxAge: maxAge,
    medianAge: medianAge,
    medianWorkload: medianWorkload,
    averageWomenWorkload: avgFemLoad,
    sortedByWorkload: sortedByWorkload
  };
}

export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const statistics = getEmployeeStatistics(employees); 
  return statistics;
}
console.log(main(dtoIn));
