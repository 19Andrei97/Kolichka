//todo ADD: Possibility to choose if publishers can bring kolichka

let allPersons = {},
  calendar = [],
  parameters = {
    // percentage of presence
    publisher: 25,
    elder: 25,
    pioneer: 50,
    // how many couple per day
    day: {
      mon: 1,
      tue: 1,
      wen: 1,
      thu: 1,
      fri: 1,
      sat: 1,
      sun: 1,
    },
  },
  numbQueue = 1,
  today = new Date(),
  currentMonth = today.getMonth(),
  currentYear = today.getFullYear(),
  firstDay,
  daysInMonth,
  difficultOne = false;

//!   CALENDAR       \\\\\\\\
showCalendar(currentMonth, currentYear);
addDaysToCalendar(daysInMonth);
function addDaysToCalendar(days) {
  calendar = [];
  for (let index = 0; index < days; index++) {
    calendar.push([]);
  }
  removeZeroDays(parameters.day);
}
function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}
function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}
function showCalendar(month, year) {
  // Clean first
  $(".couple").empty();
  $(".statistics").empty();

  let days = [
    "Monday",
    "Tuesday",
    "Wensday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  firstDay = new Date(year, month).getDay() - 1;
  if (firstDay === -1) firstDay = 6;
  daysInMonth = 32 - new Date(year, month, 32).getDate();
  let classDays,
    classFirstDay,
    date = 1;

  // Change month and year title
  $(".monthText").text(`${months[currentMonth]} ${currentYear}`);

  for (let i = 0; i < daysInMonth; i++) {
    if (days[0] === "Monday") classDays = `mon${date}`;
    else if (days[0] === "Tuesday") classDays = `tue${date}`;
    else if (days[0] === "Wensday") classDays = `wen${date}`;
    else if (days[0] === "Thursday") classDays = `thu${date}`;
    else if (days[0] === "Friday") classDays = `fri${date}`;
    else if (days[0] === "Saturday") classDays = `sat${date}`;
    else if (days[0] === "Sunday") classDays = `sun${date}`;

    if (i === 0) {
      if (days[firstDay] === "Monday") classFirstDay = `mon${date}`;
      else if (days[firstDay] === "Tuesday") classFirstDay = `tue${date}`;
      else if (days[firstDay] === "Wensday") classFirstDay = `wen${date}`;
      else if (days[firstDay] === "Thursday") classFirstDay = `thu${date}`;
      else if (days[firstDay] === "Friday") classFirstDay = `fri${date}`;
      else if (days[firstDay] === "Saturday") classFirstDay = `sat${date}`;
      else if (days[firstDay] === "Sunday") classFirstDay = `sun${date}`;
      let divDay = $(`<div class=wrapDayTitle>`).addClass(classFirstDay);
      let day = $('<h5 class="dayTitle">').text(`${i + 1} - ${days[firstDay]}`);
      divDay.append(day);
      $(".couple").append(divDay);
      date++;
      let resetDays = days.splice(firstDay + 1, days.length - firstDay - 1);
      days.unshift(...resetDays);
    } else if (date > daysInMonth) {
      break;
    } else {
      let divDay = $(`<div class=wrapDayTitle>`).addClass(classDays);
      let day = $('<h5 class="dayTitle">').text(`${i + 1} - ${days[0]}`);
      divDay.append(day);
      $(".couple").append(divDay);
      date++;
      let resetDays = days.shift();
      days.push(resetDays);
    }
  }
  addDaysToCalendar(daysInMonth);
}

//! Remove days with 0 as parameter from DOM and calendar
function removeZeroDays(week) {
  let arrIndex = [];
  for (const key in week) {
    arrIndex = [];
    if (week[key] === 0) {
      $(document).find(`div[class*=${key}]`).remove();
    }
  }
}

//! Get and Save user parameters
$("#btn-para").on("click", () => {
  let publisher = parseInt($("#publishers").val()),
    elder = parseInt($("#elders").val()),
    pioneer = parseInt($("#pioneers").val()),
    mon = parseInt($("#monday").val()),
    tue = parseInt($("#tuesday").val()),
    wen = parseInt($("#wensday").val()),
    thu = parseInt($("#thursday").val()),
    fri = parseInt($("#friday").val()),
    sat = parseInt($("#saturday").val()),
    sun = parseInt($("#sunday").val());

  parameters.publisher = publisher;
  parameters.elder = elder;
  if (elder === 0) numbQueue = 0;
  parameters.pioneer = pioneer;
  parameters.day.mon = mon;
  parameters.day.tue = tue;
  parameters.day.wen = wen;
  parameters.day.thu = thu;
  parameters.day.fri = fri;
  parameters.day.sat = sat;
  parameters.day.sun = sun;

  showCalendar(currentMonth, currentYear);
});

//! Change Publisher input percentage on change of others percentages
$(".onChangePara").on("change", function () {
  let elder = $("#elders").val(),
    pioneer = $("#pioneers").val(),
    toAdd = 100 - (parseInt(pioneer) + parseInt(elder));

  if (toAdd <= -1) $("#publishers").val(0);
  else $("#publishers").val(toAdd);

  if (parseInt(pioneer) + parseInt(elder) > 100)
    $("#elders").val(100 - parseInt(pioneer));
});

//! Activate expected perentage
$("#refreshExp").click(function () {
  if (obj.persons.length > 10) {
    let arrPub = [],
      arrEld = [],
      arrPion = [],
      error = 0;

    for (let i = 0; i < 300; i++) {
      // clean first
      allPersons = {};
      countWhichDay = firstDay;
      dayStartCheck = firstDay;
      showCalendar(currentMonth, currentYear);
      $(".textCouple").remove();
      $(".statistics").empty();
      $("#publishersExp").empty();
      $("#eldersExp").empty();
      $("#pioneersExp").empty();
      $("#errorExp").empty();

      try {
        // Start fake couple and give average statistics
        createChilds(obj, allPersons, previusAllPersons);
        pairingAlgorithm(allPersons, parameters.day, numbQueue, calendar);
        let specExp = statistics(false);
        arrPub.push(specExp[0]);
        arrEld.push(specExp[1]);
        arrPion.push(specExp[2]);
      } catch (er) {
        error++;
        if (i === 299) break;
      }
    }
    // Clean elem
    $("#publishersExp").empty();
    $("#eldersExp").empty();
    $("#pioneersExp").empty();
    $("#errorExp").empty();
    // Show percentage and let user understand the changes
    setTimeout(() => {
      $("#publishersExp").text(
        `${Math.floor(arrPub.reduce((a, b) => a + b) / arrPub.length)}%`
      );
      $("#eldersExp").text(
        `${Math.floor(arrEld.reduce((a, b) => a + b) / arrEld.length)}%`
      );
      $("#pioneersExp").text(
        `${Math.floor(arrPion.reduce((a, b) => a + b) / arrPion.length)}%`
      );
      $("#errorExp").text(`${Math.floor((error / 300) * 100)}%`);
    }, 300);
  } else {
    // Clean elem
    $("#publishersExp").empty();
    $("#eldersExp").empty();
    $("#pioneersExp").empty();
    $("#errorExp").empty();

    // Give user understand that the process worked but receive an error
    setTimeout(() => {
      $("#publishersExp").text("Not enough persons");
      $("#eldersExp").text("Not enough persons");
      $("#pioneersExp").text("Not enough persons");
      $("#errorExp").text("Not enough persons");
    }, 300);
  }
});

//! Start algorithm on click
let errorMax = 1;
$("#startPairing").on("click", function () {
  // Clean first
  allPersons = {};
  countWhichDay = firstDay;
  dayStartCheck = firstDay;
  showCalendar(currentMonth, currentYear);
  $(".textCouple").remove();
  $(".statistics").empty();

  // Check if there are enough persons in obj
  if (obj.persons.length <= 10) {
    $("#noStart").slideDown(300).attr("style", "display:block;");
    setTimeout(() => $("#noStart").fadeOut(1500), 1500);
  } else {
    // Restart if error is found for max 300 times
    if (errorMax === 300) {
      $("#tooDif").slideDown(300).attr("style", "display:block;");
      setTimeout(() => $("#tooDif").fadeOut(2000), 2000);
      errorMax = 1
    } else {
      try {
        createChilds(obj, allPersons, previusAllPersons);
        pairingAlgorithm(allPersons, parameters.day, numbQueue, calendar);
        showPairedPeoples(allPersons, calendar);
        statistics();
      } catch (error) {
        if(errorMax === 299){console.log(error);}
        errorMax++;
        $("#startPairing").click();
      }
    }
  }

  if(difficultOne){
    $("#difficultOne").slideDown(300).attr("style", "display:block;");
    setTimeout(() => $("#difficultOne").fadeOut(5000), 2000);
  }
});

//! Persons constructor
function PersonAl(fullName, type, gender, bring, otherSex, arrFree, id) {
  this.fullName = fullName;
  this.type = type;
  this.gender = gender;
  this.bring = bring;
  this.otherSex = otherSex;
  this.id = id;
  this.arrFree = arrFree;
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
  if (dayNumber % 7 === 0) dayNumber = "monday";
  else if (dayNumber % 7 === 1) dayNumber = "tuersday";
  else if (dayNumber % 7 === 2) dayNumber = "wensday";
  else if (dayNumber % 7 === 3) dayNumber = "thuersday";
  else if (dayNumber % 7 === 4) dayNumber = "friday";
  else if (dayNumber % 7 === 5) dayNumber = "saturday";
  else if (dayNumber % 7 === 6) dayNumber = "sunday";

  this.daysLastMonth[dayNumber]++;
};
PersonAl.prototype.updateTimesUsed = function () {
  this.timesUsed++;
};

//! Create child from obj and put them on allPersons
function createChilds(objTake, objPut, objPast = {}) {
  objTake.persons.forEach((val) => {
    let fullName = `${val[0]} ${val[1]}`;
    objPut[val[7]] = new PersonAl(
      fullName,
      val[2],
      val[3],
      val[4],
      val[5],
      val[6],
      val[7]
    );

    // Updating the newly created obj with past months info
    if (objPast.hasOwnProperty(val[7])) {
      // Push been paired from last months to the new obj
      objPut[val[7]].beenPaired = objPast[val[7]].beenPaired;

      // Update days of new obj based on last months
      let daysNew = objPut[val[7]].daysLastMonth;
      for (const key in daysNew) {
        daysNew[key] += objPast[val[7]].daysLastMonth[key];
      }

      // Update timesUsed
      objPut[val[7]].timesUsed += objPast[val[7]].timesUsed;
    }
  });
}

//! Start Algorithm
function pairingAlgorithm(obj, par, firstIdRule, calend) {
  let count = 0;

  // Expression to set the for loop based on parameters.day value * how many time it
  // found an element, with same key as class, in DOM
  for (const key in par) {
    count += par[key] * $(document).find(`div[class*=${key}]`).length;
  }

  for (let index = 0; index < count; index++) {
    let day = checkWhichDay();
    let arrCouple = findIds(obj, firstIdRule, day);

    calend[day - firstDay].push(arrCouple); // push couple on calendar
  }
}

//! Find both Ids
function findIds(obj, firstIdRule, day) {
  let bring,
    other,
    arrIds = [],
    arrIds1 = [],
    type = queueSet(),
    arrFiltered;

  // Set array for first person based on people Free Days
  for (const key in obj) {
    if (obj[key].arrFree[day % 7]) arrIds1.push(key);
  }

  // First id
  let firstType = queueSet(firstIdRule),
    firstId = findIdLessUsed(obj, day, firstType, arrIds1);

  // Second id
  (bring = obj[firstId].bring),
    (other = obj[firstId].otherSex),
    (arrIds = []),
    type = queueSet();

  // Check to not pair same person and persons that have been paired already and free days
  for (const key in obj) {
    if (
      key !== firstId &&
      !obj[key].beenPaired.includes(firstId) &&
      obj[key].arrFree[day % 7]
    )
      arrIds.push(key);
  }

  // Checking bring and other sex compatibility
  arrFiltered = arrIds
    .filter((val) => {
      if (obj[val].bring || bring) return val;
    })
    .filter((val) => {
      if (other) return val;
      else if (obj[val].gender === obj[firstId].gender) return val;
    });

  // Check less used from previus array
  let secondId = findIdLessUsed(obj, day, type, arrFiltered, firstId);

  // Update both Ids (if id was already been paired with other id don't push it again)
  if(obj[firstId].beenPaired.indexOf(secondId) === -1) obj[firstId].beenPaired.push(secondId);
  obj[firstId].updateDay(day);
  obj[firstId].updateTimesUsed();

  if(obj[secondId].beenPaired.indexOf(firstId) === -1) obj[secondId].beenPaired.push(firstId);
  obj[secondId].updateDay(day);
  obj[secondId].updateTimesUsed();

  return [firstId, secondId];
}

//! Check which day to set pairing
let countWhichDay = firstDay,
  dayStartCheck = firstDay;
function checkWhichDay() {
  let week = parameters.day,
    numberTranslate = "";

  for (let i = 0; i < daysInMonth; i++) {
    let number = dayStartCheck % 7;
    if (number === 0) numberTranslate = "mon";
    else if (number === 1) numberTranslate = "tue";
    else if (number === 2) numberTranslate = "wen";
    else if (number === 3) numberTranslate = "thu";
    else if (number === 4) numberTranslate = "fri";
    else if (number === 5) numberTranslate = "sat";
    else if (number === 6) numberTranslate = "sun";

    if (calendar[countWhichDay - firstDay].length < week[numberTranslate]) {
      //! COMMON ERRORS
      return countWhichDay;
    } else {
      dayStartCheck++;
      countWhichDay += 1;
    }
  }
}

//! Choose which between Pioneer or Elder or Publisher
function queueSet(rule) {
  let percent = Math.floor(Math.random() * 100);
  if (rule === 0) {
    // return only pioneer
    return 1;
  } else if (rule === 1) {
    // return only pioneer or elder
    let toAdd = (100 - (parameters.pioneer + parameters.elder)) / 2,
      newPioneer = parameters.pioneer + toAdd,
      newElder = parameters.elder + toAdd;
    if (percent <= newPioneer) {
      return 1;
    } else if (percent > newPioneer && percent < newPioneer + newElder) {
      return 2;
    }
  } else {
    // return pioneer, elder or publisher (some advantages for publishers)
    if (percent <= parameters.pioneer - 10) {
      return 1;
    } else if (
      percent > parameters.pioneer - 10 &&
      percent < parameters.pioneer + parameters.elder - 10
    ) {
      return 2;
    } else {
      return 3;
    }
  }
}

//! Find ID of less used person
function findIdLessUsed(obj, day, first, arr = [], firstId) {
  let arrTotal = [[], [], []]; // id - total count - day count
  let min, indexTotal, min1, indexWeek;

  // translate day
  if (day % 7 === 0) day = "monday";
  else if (day % 7 === 1) day = "tuersday";
  else if (day % 7 === 2) day = "wensday";
  else if (day % 7 === 3) day = "thuersday";
  else if (day % 7 === 4) day = "friday";
  else if (day % 7 === 5) day = "saturday";
  else if (day % 7 === 6) day = "sunday";

  // Check which type to choose
  if (first === 1) {
    arr.forEach((val) => {
      if (obj[val].type === "Pioneer") {
        arrTotal[0].push(val);
        arrTotal[1].push(obj[val].timesUsed);
        arrTotal[2].push(obj[val].daysLastMonth[day]);
      }
    });
  } else if (first === 2) {
    arr.forEach((val) => {
      if (obj[val].type === "Elder") {
        arrTotal[0].push(val);
        arrTotal[1].push(obj[val].timesUsed);
        arrTotal[2].push(obj[val].daysLastMonth[day]);
      }
    });
  } else {
    arr.forEach((val) => {
      if (obj[val].type === "Publisher") {
        arrTotal[0].push(val);
        arrTotal[1].push(obj[val].timesUsed);
        arrTotal[2].push(obj[val].daysLastMonth[day]);
      }
    });
  }

  // Prevent further errors if errorMax reached 299 loops
  if(arrTotal[0].length === 0 && errorMax === 299){
    let arrPast = obj[firstId].beenPaired;
    if(arrPast.length === 0) throw "Can't proceed, is better to throw the error banner!"

    arrPast.forEach((val)=>{
      arrTotal[0].push(val);
      arrTotal[1].push(obj[val].timesUsed);
      arrTotal[2].push(obj[val].daysLastMonth[day]);
    })

    difficultOne = true
  }

  min = arrTotal[1].reduce((a, b) => Math.min(a, b)); //! COMMON ERRORS
  indexTotal = arrTotal[1].findIndex((val) => val === min);

  min1 = arrTotal[2].reduce((a, b) => Math.min(a, b));
  indexWeek = arrTotal[2].findIndex((val) => val === min1);

  // if is the same index return total count Id
  if (indexTotal === indexWeek) return arrTotal[0][indexTotal];
  // if index is different check if the person that was chosen for the week haven't
  // been choosen more on the total than the other
  else {
    if (arrTotal[1][indexWeek] >= min) return arrTotal[0][indexTotal];
    else return arrTotal[0][indexWeek];
  }
}

//! Show paired couple
function showPairedPeoples(obj, arr) {
  let dayIndexDom = 0;
  arr.forEach((val) => {
    if (val.length !== 0) {
      let dayDom = $(".couple").children().eq(dayIndexDom);

      val.forEach((val) => {
        let firstId = val[0],
          secondId = val[1];

        if (firstId === "Error") {
          let div1 = $('<div class="textCouple"></div>'),
            text = $("<h5></h5>").text(`<b>${secondId}</b>`);
          div1.append(text);
          dayDom.append(div1);
        } else {
          let div1 = $('<div class="textCouple"></div>'),
            text = $("<h5></h5>").text(
              `${obj[firstId].fullName} - ${obj[secondId].fullName}`
            );
          div1.append(text);
          dayDom.append(div1);
        }
      });
      dayIndexDom++;
    }
  });
}

//! Analize selected peoples
function statistics(rule) {
  let pioneers = 0,
    elders = 0,
    publishers = 0,
    countTest = 0,
    statObj = {};

  calendar.forEach((val) => {
    val.forEach((val) => {
      let first = val[0],
        second = val[1];
      if (allPersons[first].type === "Pioneer") {
        pioneers += 1;
      } else if (allPersons[first].type === "Elder") {
        elders += 1;
      } else {
        publishers += 1;
      }
      if (allPersons[second].type === "Pioneer") {
        pioneers += 1;
      } else if (allPersons[second].type === "Elder") {
        elders += 1;
      } else {
        publishers += 1;
      }
      statObj[first] = {};
      statObj[second] = {};

      statObj[first].been = allPersons[first].beenPaired;
      statObj[second].been = allPersons[second].beenPaired;
      countTest += 2;
    });
  });

  if (rule) {
    statisticsShow(rule, pioneers, elders, publishers, countTest, statObj);
  } else {
    let arrExp = statisticsShow(
      rule,
      pioneers,
      elders,
      publishers,
      countTest,
      statObj
    );
    return arrExp;
  }
}

//! Add to DOM statistics
function statisticsShow(
  rule = true,
  pioneers,
  elders,
  publishers,
  countTest,
  statObj
) {
  let div = $(".statistics"),
    pion = Math.floor((pioneers / countTest) * 100),
    eld = Math.floor((elders / countTest) * 100),
    pub = Math.floor((publishers / countTest) * 100);

  // Based on rule, output in different place
  if (rule) {
    let divGen = $("<div></div>").attr(
        "style",
        "margin: 10px; border-bottom: 2px solid grey;"
      ),
      textGen = $("<h5></h5>").html(
        `<b>Pioneers:</b> ${pion}%<br><b>Elders:</b> ${eld}%<br><b>Publishers:</b> ${pub}%<br>`
      );
    divGen.append(textGen);
    div.append(divGen);

    let divAll = $("<div></div>").attr("style", "margin: 10px;");

    for (const key in statObj) {
      let name = allPersons[key].fullName;
      let been = statObj[key].been;

      let domName = $('<h5 style="margin:5px 0px;"></h5>').html(
        `<b>${name}:</b><br>`
      );
      divAll.append(domName);
      been.forEach((val, i) => {
        if (been.length - 1 !== i) {
          let name = allPersons[val].fullName;
          let domBeen = $('<p style="display:inline;">').text(`${name}, `);
          divAll.append(domBeen);
        } else {
          let name = allPersons[val].fullName;
          let domBeen = $('<p style="display:inline;">').text(`${name}`);
          divAll.append(domBeen);
        }
      });
      div.append(divAll);
    }
  } else {
    return [pub, eld, pion];
  }
}
