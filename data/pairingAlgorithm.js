//? Delete Queue

let allPersons = {},
  calendar = [[], [], [], [], [], [], []], // 7 days
  parameters = {
    // percentuali di presenza per tipo
    publisher: 25,
    elder: 25,
    pioneer: 50,
    // how many couple per day
    day: {
      mon: 2,
      tue: 2,
      wen: 2,
      thu: 2,
      fri: 2,
      sat: 2,
      sun: 2,
    },
  },
  queue = [[], [], []], // Pioneer / Elder / Publisher
  obj1 = {
    persons: [
      ["Andrea", "Rossi", "Publisher", "Female", false, true, "N0"],
      ["Paolo", "Bonolis", "Pioneer", "Male", true, true, "N1"],
      ["Giorgia", "Rossi", "Pioneer", "Female", false, true, "N2"],
      ["Davide", "Rossi", "Elder", "Male", true, true, "N3"],
      ["Paolo", "Galassini", "Publisher", "Male", true, false, "N4"],
      ["Raffaele", "Fabbri", "Elder", "Male", true, true, "N5"],
    ],
  };

//! Start algorithm on click
// $("#startPairing").on("click", function () {
//   // console.log($(this).parent().parent())
//   //   if (obj.persons.length === 0 || obj.persons.length === 1) {
//   //     // banner nothing to add
//   //     $("#noStart").slideDown(300).attr("style", "display:block;");
//   //     setTimeout(() => $("#noStart").fadeOut(500), 1500);
//   //   } else {
//   createChilds(obj1);
//   pairingAlgorithm();
//   // console.log(allPersons)
//   //   }
// });

//! Persons constructor
function PersonAl(fullName, type, gender, bring, otherSex, id) {
  this.fullName = fullName;
  this.type = type;
  this.gender = gender;
  this.bring = bring;
  this.otherSex = otherSex;
  this.id = id;
  this.timesUsed = 0;
  this.beenPaired = [];
  this.daysLastMonth = {
    monday: 0,
    tuersday: 0,
    wensday: 0,
    thuersday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  };
}

PersonAl.prototype.addPaired = function (id) {
  this.beenPaired.push(id);
};
PersonAl.prototype.updateDay = function (dayNumber) {
  if (dayNumber === 0) dayNumber = "monday";
  else if (dayNumber === 1) dayNumber = "tuersday";
  else if (dayNumber === 2) dayNumber = "wensday";
  else if (dayNumber === 3) dayNumber = "thuersday";
  else if (dayNumber === 4) dayNumber = "friday";
  else if (dayNumber === 5) dayNumber = "saturday";
  else if (dayNumber === 6) dayNumber = "sunday";

  this.daysLastMonth[dayNumber]++;
};
PersonAl.prototype.updateTimesUsed = function () {
  this.timesUsed++;
};

function createChilds(objTake, objPut) {
  objTake.persons.forEach((val) => {
    let fullName = `${val[0]} ${val[1]}`;
    objPut[val[6]] = new PersonAl(
      fullName,
      val[2],
      val[3],
      val[4],
      val[5],
      val[6]
    );
  });
}

function pairingAlgorithm(obj) {
  let count = 0
  for (const key in parameters.day) {
    count += parameters.day[key]
  }

  for (let index = 0; index < count; index++) {
    firstPerson(obj);
  }
}

function firstPerson(obj) {
  let day = checkWhichDay(),
    type = queueSet(1),
    idLess = findIdLessUsed(obj, day, type);

  obj[idLess].updateDay(day);
  obj[idLess].updateTimesUsed();

  secondPerson(obj, idLess, day);
}

//! Find second person
function secondPerson(obj, firstPer, day) {
  let bring = obj[firstPer].bring,
    other = obj[firstPer].otherSex,
    arrIds = [],
    type = queueSet();

  for (const key in obj) {
    if (key !== firstPer) arrIds.push(key);
  }

  // Checking bring and other sex compatibility
  let arrFiltered = arrIds
    .filter((val) => {
      if (obj[val].bring || bring) return val;
    })
    .filter((val) => {
      if (other) return val;
      else {
        if (obj[val].gender === obj[firstPer].gender) return val;
      }
    });

  // Check less used from previus array
  let secondPers = findIdLessUsed(obj, day, type, arrFiltered)
  calendar[day].push([firstPer, secondPers])

  console.log(calendar)
}

//! Check which day to set pairing
function checkWhichDay() {
  let week = parameters.day;

  if (calendar[0].length < week.mon) return 0;
  else if (calendar[1].length < week.tue) return 1;
  else if (calendar[2].length < week.wen) return 2;
  else if (calendar[3].length < week.thu) return 3;
  else if (calendar[4].length < week.fri) return 4;
  else if (calendar[5].length < week.sat) return 5;
  else if (calendar[6].length < week.sun) return 6;
}

//! Choose which between Pioneer or Elder
function queueSet(a) {
  let percent = Math.floor(Math.random() * 100);
  if (a === 1) {
    let toAdd = (100 - (parameters.pioneer + parameters.elder)) / 2,
      newPioneer = parameters.pioneer + toAdd,
      newElder = parameters.elder + toAdd;
    if (percent <= newPioneer) {
      return 1;
    } else if (percent > newPioneer && percent < newPioneer + newElder) {
      return 2;
    }
  } else {
    if (percent <= parameters.pioneer) {
      return 1;
    } else if (
      percent > parameters.pioneer &&
      percent < parameters.pioneer + parameters.elder
    ) {
      return 2;
    } else {
      return 3;
    }
  }
}

//todo FIX: leave blank  when can't find or put another person
//! Find ID of less used person
function findIdLessUsed(obj, day, first, arr = []) {
  let arrTotal = [[], [], []]; // id - total time used - specific day used
  // translate day
  if (day === 0) day = "monday";
  else if (day === 1) day = "tuersday";
  else if (day === 2) day = "wensday";
  else if (day === 3) day = "thuersday";
  else if (day === 4) day = "friday";
  else if (day === 5) day = "saturday";
  else if (day === 6) day = "sunday";
  
  // Check if there are specific Ids to choose from
  if (arr.length === 0) {
    // Check what type to return
    if (first === 1) {
      for (const key in obj) {
        if (obj[key].type === "Pioneer") {
          arrTotal[0].push(key);
          arrTotal[1].push(obj[key].timesUsed);
          arrTotal[2].push(obj[key].daysLastMonth[day]);
        }
      }
    } else if (first === 2) {
      for (const key in obj) {
        if (obj[key].type === "Elder") {
          arrTotal[0].push(key);
          arrTotal[1].push(obj[key].timesUsed);
          arrTotal[2].push(obj[key].daysLastMonth[day]);
        }
      }
    } else {
      for (const key in obj) {
        if (obj[key].type === "Publisher") {
          arrTotal[0].push(key);
          arrTotal[1].push(obj[key].timesUsed);
          arrTotal[2].push(obj[key].daysLastMonth[day]);
        }
      }
    }
  } else {
    if (first === 1) {
      arr.forEach((val) => {
        if (obj[val].type === "Pioneer") {
          arrTotal[0].push(val);
          arrTotal[1].push(obj[val].timesUsed);
          arrTotal[2].push(obj[val].daysLastMonth[day]);
        } else {
          console.log('No one found for this research 1') 
        }
      })
    } else if (first === 2) {
      arr.forEach((val) => {
        if (obj[val].type === "Elder") {
          arrTotal[0].push(val);
          arrTotal[1].push(obj[val].timesUsed);
          arrTotal[2].push(obj[val].daysLastMonth[day]);
        } else {
          console.log('No one found for this research 2') 
        }
      })
    } else {
      arr.forEach((val) => {
        if (obj[val].type === "Publisher") {
          arrTotal[0].push(val);
          arrTotal[1].push(obj[val].timesUsed);
          arrTotal[2].push(obj[val].daysLastMonth[day]);
        }else {
          console.log('No one found for this research 3') 
        }
      })
    }
  }

  let min = arrTotal[1].reduce((a, b) => {
    if (a > b) a = b;
    return a;
  });
  let indexTotal = arrTotal[1].findIndex((val) => {
    return val === min;
  });
  let min1 = arrTotal[2].reduce((a, b) => Math.min(a, b));
  let indexWeek = arrTotal[2].findIndex((val) => {
    return val === min1;
  });

  // if is the same index return one
  if (indexTotal === indexWeek) return arrTotal[0][indexTotal];
  // if index is different check if the person that was chosen for the week haven't
  // been choosen more on the total than the other
  else {
    if (arrTotal[1][indexWeek] >= min) return arrTotal[0][indexTotal];
    else return arrTotal[0][indexWeek];
  }
}
