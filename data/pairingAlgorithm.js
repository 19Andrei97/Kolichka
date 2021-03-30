//todo ADD: Let the user change parameters
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
  };

//! Start algorithm on click
$("#startPairing").on("click", function () {
  try{
    allPersons = {};
    calendar = [[], [], [], [], [], [], []];
    $('.textCouple').remove()
    $('.statistics').empty()
  } catch (e){
    console.log(e)
  }
  // console.log($(this).parent().parent())
    // check first if there are enough persons in obj
    if (obj.persons.length <= 10) {
      // banner nothing to add
      $("#noStart").slideDown(300).attr("style", "display:block;");
      setTimeout(() => $("#noStart").fadeOut(500), 1500);
    } else {
    createChilds(obj, allPersons);
    pairingAlgorithm(allPersons);
    }
  // call fn in getShowPeople.js to show paired couple
  showPairedPeoples(calendar)
});

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

//! Create child from obj 
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

//! Start Algorithm fn
function pairingAlgorithm(obj) {
  let count = 0;
  for (const key in parameters.day) {
    count += parameters.day[key];
  }

  for (let index = 0; index < count; index++) {
    firstPerson(obj);
  }
}

//! Find first person
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

  // Check to not pair same pareson and persons that have been paired already
  for (const key in obj) {
    if (key !== firstPer && !obj[key].beenPaired.includes(firstPer))
      arrIds.push(key);
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
  let secondPers = findIdLessUsed(obj, day, type, arrFiltered);
  
  // Update Calendar and past paired for both persons
  obj[firstPer].beenPaired.push(secondPers)
  obj[secondPers].beenPaired.push(firstPer)
  obj[secondPers].updateDay(day);
  obj[secondPers].updateTimesUsed();
  calendar[day].push([firstPer, secondPers]);
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

//! Find ID of less used person
function findIdLessUsed(obj, day, first, arr = []) {
  let arrTotal = [[], [], []]; // id - total count - day count

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
        } 
        // else {
        //   // console.log("Other person added! 1");
        //   arrTotal[0].push(val);
        //   arrTotal[1].push(obj[val].timesUsed);
        //   arrTotal[2].push(obj[val].daysLastMonth[day]);
        // }
      });
    } else if (first === 2) {
      arr.forEach((val) => {
        if (obj[val].type === "Elder") {
          arrTotal[0].push(val);
          arrTotal[1].push(obj[val].timesUsed);
          arrTotal[2].push(obj[val].daysLastMonth[day]);
        } 
        // else {
        //   // console.log("Other person added! 2");
        //   arrTotal[0].push(val);
        //   arrTotal[1].push(obj[val].timesUsed);
        //   arrTotal[2].push(obj[val].daysLastMonth[day]);
        // }
      });
    } else {
      arr.forEach((val) => {
        if (obj[val].type === "Publisher") {
          arrTotal[0].push(val);
          arrTotal[1].push(obj[val].timesUsed);
          arrTotal[2].push(obj[val].daysLastMonth[day]);
        } 
        // else {
        //   // console.log("Other person added! 3");
        //   arrTotal[0].push(val);
        //   arrTotal[1].push(obj[val].timesUsed);
        //   arrTotal[2].push(obj[val].daysLastMonth[day]);
        // }
      });
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

  // if is the same index return total count Id
  if (indexTotal === indexWeek) return arrTotal[0][indexTotal];
  // if index is different check if the person that was chosen for the week haven't
  // been choosen more on the total than the other
  else {
    if (arrTotal[1][indexWeek] >= min) return arrTotal[0][indexTotal];
    else return arrTotal[0][indexWeek];
  }
}

//! Analize selected peoples
let pioneers = 0, elders = 0, publishers = 0, countTest = 0, statObj = {}
function statistics(firstId, secondId){
  countTest+=2

  if(allPersons[firstId].type === "Pioneer") {
    pioneers+=1
  } else if (allPersons[firstId].type === "Elder") {
    elders+=1
  } else {
    publishers+=1
  }

  if(allPersons[secondId].type === "Pioneer") {
    pioneers+=1
  } else if (allPersons[secondId].type === "Elder"){
    elders+=1
  } else {
    publishers+=1
  }

  statObj[firstId] = {}
  statObj[secondId] = {}

  statObj[firstId].been = allPersons[firstId].beenPaired
  statObj[secondId].been = allPersons[secondId].beenPaired
}

//! Add to DOM statistics
function statisticsShow(){
  let div = $('.statistics'),
    pion = Math.floor(pioneers/countTest*100),
    eld = Math.floor(elders/countTest*100),
    pub = Math.floor(publishers/countTest*100);

  console.log(allPersons)
  console.log(statObj)

  let divGen = $('<div></div>').attr('style', 'margin: 10px; border-bottom: 2px solid grey;'),
    textGen = $('<h5></h5>').html(`<b>Pioneers:</b> ${pion}%<br><b>Elders:</b> ${eld}%<br><b>Publishers:</b> ${pub}%<br>`)
  divGen.append(textGen)
  div.append(divGen)

  let divAll = $('<div></div>').attr('style', 'margin: 10px;')
  for (const key in statObj) {
    let name = allPersons[key].fullName
    let been = statObj[key].been

    let domName = $('<h5 style="margin:5px 0px;"></h5>').html(`<b>${name}:</b><br>`)
    divAll.append(domName)
    been.forEach((val, i)=>{
      if(been.length-1 !== i) {
        let name = allPersons[val].fullName
        let domBeen = $('<p style="display:inline;">').text(`${name}, `)
        divAll.append(domBeen)
      } else {
        let name = allPersons[val].fullName
        let domBeen = $('<p style="display:inline;">').text(`${name}`)
        divAll.append(domBeen)
      }

    })
    div.append(divAll)
  }
}