//todo ADD: SearchBar
//todo ADD: Sort people

let count = 0,
  obj = { persons: [], deactivated: [] }, //! Obj that will be used to stored all persons
  partenerTranslate,
  canBringTranslate,
  monday,
  tuesday,
  wensday,
  thursday,
  friday,
  saturday,
  sunday;

//! Reading new Person and add it
function addIt(name, surname, type, gender, partner, canBring, arrDays, id, rule = true) {
  let idChecked;
  if (id[0] === "N") idChecked = id;
  else idChecked = `N${id}`;
  let arr = [name, surname, type, gender, canBring, partner, arrDays, idChecked];

  // Traslating true and false with Yes and No
  if (partner) {
    partenerTranslate = "Yes";
  } else {
    partenerTranslate = "No";
  }
  if (canBring) {
    canBringTranslate = "Yes";
  } else {
    canBringTranslate = "No";
  }
  if(arrDays[0]) {
    monday = 'Yes';
  } else {
    monday = 'No';
  }
  if(arrDays[1]) {
    tuesday = 'Yes';
  } else {
    tuesday = 'No';
  }
  if(arrDays[2]) {
    wensday = 'Yes';
  } else {
    wensday = 'No';
  }
  if(arrDays[3]) {
    thursday = 'Yes';
  } else {
    thursday = 'No';
  }
  if(arrDays[4]) {
    friday = 'Yes';
  } else {
    friday = 'No';
  }
  if(arrDays[5]) {
    saturday = 'Yes';
  } else {
    saturday = 'No';
  }
  if(arrDays[6]) {
    sunday = 'Yes';
  } else {
    sunday = 'No';
  }

  // Setting obj with key/value
  obj.persons.push(arr);

  // Building DOM
  let div1 = $("<div>").addClass("panel panel-default dinamicDiv"),
    div2 = $("<div>").addClass("panel-heading procHead"),
    h5 = $("<h5>").addClass("panel-body").addClass("headPersonsAdjusted"),
    a = $(
      '<a data-toggle="collapse" class="procHeadText" data-parent="#accordion"></a>'
    )
      .text(`${name} ${surname}`)
      .attr("href", `#${count}`),
    divButtons = $("<div></div>").attr("style", "margin-left:10px;"),
    deleteBtn = $(
      "<button data-toggle='tooltip' title='Delete' onclick='deleteButton(this)'><span class='glyphicon glyphicon-trash'></span></button>"
    ).attr("id", `N${count}`),
    modifyBtn = $(
      "<button data-toggle='tooltip' title='Modify' onclick='modifyButton(this)'><span class='glyphicon glyphicon-pencil'></span></button>"
    ).attr("id", `N${count}`),
    deactiveBtn = $(
      "<button data-toggle='tooltip' title='Deactivate' onclick='deactivateButton(this)'><span class='glyphicon glyphicon-ban-circle'></span</button>"
    ).attr("id", `N${count}`),
    div3 = $("<div>")
      .addClass("panel-collapse collapse procbody")
      .attr("id", `${count}`),
    info = $("<div>")
      .addClass("panel-body infoPadding")
      .html(
        `<b>Name:</b> ${name}<br><b>Surname:</b> ${surname}<br><b>Type:</b> ${type}<br><b>Sex:</b> ${gender}<br><b>Transport:</b> ${canBringTranslate}<br><b>Partner:</b> ${partenerTranslate}<br><p style="margin: 10px 0px 0px 0px;"><b>Free Days</b></p><div style="margin-left: 10px;">Monday: ${monday}<br>Tuesday: ${tuesday}<br>Wensday: ${wensday}<br>Thursday: ${thursday}<br>Friday: ${friday}<br>Saturday: ${saturday}<br>Sunday: ${sunday}</div>`
      );

  divButtons.append(deleteBtn);
  divButtons.append(modifyBtn);
  divButtons.append(deactiveBtn);
  h5.append(a);
  div2.append(h5);
  div2.append(divButtons);
  div1.append(div2);
  div3.append(info);
  div1.append(div3);

  // Decide where to put person added
  if (type === "Publisher") $("#publishersCollapse").append(div1);
  else if (type === "Elder") $("#eldersCollapse").append(div1);
  else $("#pioneersCollapse").append(div1);

  // Show filter length
  calcolateLength();

  count++;
  
  // Add to Deactivated persons
  if (!rule) {
    deactiveBtn.click()
  }
}

//! Listen to key pression to execute buttons
$(document).on("keydown", function (e) {
  // console.log(e.originalEvent.code)
  if (
    e.originalEvent.code === "Enter" &&
    $("#myModal").css("display") !== "none"
  ) {
    $("#btn-add").click();
  } else if (e.originalEvent.code === "Enter") {
    $("#startPairing").click();
  }
  // if (e.originalEvent.code === "KeyA") $("#addPersonBtn").click();
});

//! Get propreties on form button
$("#btn-add").on("click", function (e) {
  // confirm adding, animation
  $("#successfully").slideToggle(300).attr("style", "display:block;");
  setTimeout(() => $(".alert").fadeOut(500), 1500);

  // getting propreties
  let name = $("#nomePr").val(),
    surname = $("#cognomePr").val(),
    type = $("input[class='type']:checked").attr("id"),
    gender = $("input[class='gndr']:checked").attr("id"),
    partner = $("#sessoOpposto"),
    canBring = $("#canBring"),
    coupleDays = $('.coupleDays');

  let partnerChecked = partner[0].checked,
    canBringChecked = canBring[0].checked,
    monday = coupleDays[0].checked,
    tuesday = coupleDays[1].checked,
    wensday = coupleDays[2].checked,
    thursday = coupleDays[3].checked,
    friday = coupleDays[4].checked,
    saturday = coupleDays[5].checked,
    sunday = coupleDays[6].checked;

  addIt(name, surname, type, gender, partnerChecked, canBringChecked, [monday,tuesday,wensday,thursday,friday,saturday,sunday], count);

  // clear form names
  $(".formReset").trigger("reset");
});

//! Export File clicking on button
$("#exportFile").on("click", function () {
  if (
    confirm(
      "Are you sure you want to save the file? Put the file in a safe folder, as Proclamatori."
    )
  ) {
    var a = document.createElement("a");
    content = JSON.stringify(obj);
    var file = new Blob([content], { type: "data/json" });
    urlFile = URL.createObjectURL(file);
    a.href = urlFile;
    a.download = "publishers_YOURCONGREGATION.json";
    a.click();
  }
});

//! Create a hidden file type input to import a file & On click trigger inputFile
let inputFile = $('<input type="file" id="inputElement" accept="json"/>');
$("#importFile").on("click", function () {
  inputFile.click();
});

//! Read data from imported file and invoke addIt
inputFile.on("change", function (evt) {
  var files = evt.target.files; // FileList object

  // use the 1st file from the list
  f = files[0];

  var reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function (theFile) {
    return function (e) {
      let parsed = JSON.parse(e.target.result);

      // add info from obj.persons
      parsed.persons.forEach(val => {
        val.pop();
        val.push(count);
        addIt(...val);
      });

      // add info from obj.deactivated
      parsed.deactivated.forEach(val => {
        val.pop();
        val.push(count);
        addIt(...val, false)
      })
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);
});

//! Delete Person from DOM and OBJ
function deleteButton(e) {
  obj.persons.forEach((val, i) => {
    if (val.includes(e.id)) obj.persons.splice(i, 1);
  });

  $(e).parent().parent().remove();

  calcolateLength();
}

//! Add Modify for DOM and call fn to modify OBJ
function modifyButton(e) {
  let inputModify,
    nameCheck,
    nameCheck1,
    nameCheck2,
    personInObj,
    switching = 0,
    monday,
    tuesday,
    wensday,
    thursday,
    friday,
    saturday,
    sunday;

  let parent = $(e).parent().parent().next().children();
  let previusText = parent.html();
  parent.empty();

  // GENERATE DOM FOR MODIFING
  obj.persons.forEach((val, j) => {
    if (val.includes(e.id)) {
      personInObj = j;
      val.forEach((val, i) => {
        if (i === 6) {
        } else if (i === 2) {
          let div = $("<div style='margin:5px 0px'>");
          let form = $("<form></form>");
          nameCheck = $(
            '<label class="radio-inline textInformationModify" style="margin:0px 0px 0px 5px"><input class="type" id="Publisher" type="radio" name="optradio" checked>Publisher</label>'
          );
          nameCheck1 = $(
            '<label class="radio-inline textInformationModify" style="margin:0px 0px 0px 5px"><input class="type" id="Pioneer" type="radio" name="optradio">Pioneer</label>'
          );
          nameCheck2 = $(
            '<label class="radio-inline textInformationModify" style="margin:0px 0px 0px 5px"><input class="type" id="Elder" type="radio" name="optradio">Elder</label>'
          );

          div.append(nameCheck).append(nameCheck1).append(nameCheck2);
          form.append(div);
          parent.append(form);
        } else if (i === 3) {
          let div = $("<div style='margin:5px 0px'>");
          let form = $("<form></form>");
          nameCheck = $(
            '<label class="radio-inline textInformationModify" style="margin:0px 0px 0px 5px"><input class="type" id="FemaleModify" type="radio" name="optradio" checked>Female</label>'
          );
          nameCheck1 = $(
            '<label class="radio-inline textInformationModify" style="margin:0px 0px 0px 5px"><input class="type" id="MaleModify" type="radio" name="optradio">Male</label>'
          );

          div.append(nameCheck).append(nameCheck1);
          form.append(div);
          parent.append(div);
        } else if (typeof val === "string") {
          inputModify = $(`<input type='text' value='${val}'>`);

          parent.append(inputModify);
        } else if (val === true || val === false) {
          let div = $("<div style='margin:5px 0px'>");
          if (switching === 0) {
            inputModify = $(
              `<input type='checkbox' style="position: absolute; z-index: 1000;" checked>`
            );
            nameCheck = $(
              "<p class='textInformationModify checkbox-inline' style='margin-left: 0px !important'>"
            ).text("Can transport kolichka");
            switching = 1;
          } else {
            inputModify = $(
              `<input style="position: absolute; z-index: 1000;" type='checkbox' checked>`
            );
            nameCheck = $(
              "<p class='textInformationModify checkbox-inline' style='margin-left: 0px !important'>"
            ).text("Can be partnered with other sex");
          }

          div.append(inputModify).append(nameCheck);
          parent.append(div);
        } else if (Array.isArray(val)) {
          let div = $("<div style='margin:10px 0px'>"),
            textFree = ("<p style='margin-bottom: 5px;'><b>Free Days</b></p>"),
            div1 = $("<div class='divDaysMdf'>"),
            div2 = $("<div class='divDaysMdf'>"),
            div3 = $("<div class='divDaysMdf'>"),
            div4 = $("<div class='divDaysMdf'>"),
            div5 = $("<div class='divDaysMdf'>"),
            div6 = $("<div class='divDaysMdf'>"),
            div7 = $("<div class='divDaysMdf'>"),
          
          monday = $('<input class="coupleDaysMdf" type="checkbox" value="Monday" checked><p class="daysMdf textInformationModify checkbox-inline">Monday</p>')
          tuesday = $('<input class="coupleDaysMdf" type="checkbox" value="Tuesday" checked><p class="daysMdf textInformationModify checkbox-inline">Tuesday</p>')
          wensday = $('<input class="coupleDaysMdf" type="checkbox" value="Wensday" checked><p class="daysMdf textInformationModify checkbox-inline">Wensday</p>')
          thursday = $('<input class="coupleDaysMdf" type="checkbox" value="Thursday" checked><p class="daysMdf textInformationModify checkbox-inline">Thursday</p>')
          friday = $('<input class="coupleDaysMdf" type="checkbox" value="Friday" checked><p class="daysMdf textInformationModify checkbox-inline">Friday</p>')
          saturday = $('<input class="coupleDaysMdf" type="checkbox" value="Saturday" checked><p class="daysMdf textInformationModify checkbox-inline">Saturday</p>')
          sunday = $('<input class="coupleDaysMdf" type="checkbox" value="Sunday" checked><p class="daysMdf textInformationModify checkbox-inline">Sunday</p>')

          div1.append(monday)
          div2.append(tuesday)
          div3.append(wensday)
          div4.append(thursday)
          div5.append(friday)
          div6.append(saturday)
          div7.append(sunday)
          div.append(textFree).append(div1,div2,div3,div4,div5,div6,div7)
          parent.append(div);
        }
      });
    }
  });
  let undoModify = $("<button>Undo</button>");
  let saveModify = $("<button>Save</button>");
  parent.append(undoModify).append(saveModify);

  // UNDO FUNCTION
  undoModify.on("click", function () {
    parent.empty();
    parent.append(previusText);
  });

  // MODIFY FUNCTION OBJ AND DOM INFO
  saveModify.on("click", function () {
    let all = parent.children(),
      type = all.eq(2).children().children(),
      valType,
      gender = all.eq(3).children(),
      valGender,
      canBring = all.eq(4).children().eq(0).prop("checked"),
      partner = all.eq(5).children().eq(0).prop("checked"),
      mondayM = all.eq(6).children().eq(1).children().eq(0).prop("checked"),
      tuesdayM = all.eq(6).children().eq(2).children().eq(0).prop("checked"),
      wensdayM = all.eq(6).children().eq(3).children().eq(0).prop("checked"),
      thursdayM = all.eq(6).children().eq(4).children().eq(0).prop("checked"),
      fridayM = all.eq(6).children().eq(5).children().eq(0).prop("checked"),
      saturdayM = all.eq(6).children().eq(6).children().eq(0).prop("checked"),
      sundayM = all.eq(6).children().eq(7).children().eq(0).prop("checked");

    type.each((i, val) => {
      if ($(val).eq(0).children().eq(0).prop("checked"))
        valType = $(val).text();
    });

    gender.each((i, val) => {
      if ($(val).children().eq(0).prop("checked")) valGender = $(val).text();
    });

    if (canBring) {
      canBring = "Yes";
    } else {
      canBring = "No";
    }
    if (partner) {
      partner = "Yes";
    } else {
      partner = "No";
    }
    if (mondayM) {
      mondayM = "Yes"
    } else {
      mondayM = "No"
    }
    if (tuesdayM) {
      tuesdayM = "Yes"
    } else {
      tuesdayM = "No"
    }
    if (wensdayM) {
      wensdayM = "Yes"
    } else {
      wensdayM = "No"
    }
    if (thursdayM) {
      thursdayM = "Yes"
    } else {
      thursdayM = "No"
    }
    if (fridayM) {
      fridayM = "Yes"
    } else {
      fridayM = "No"
    }
    if (saturdayM) {
      saturdayM = "Yes"
    } else {
      saturdayM = "No"
    }
    if (sundayM) {
      sundayM = "Yes"
    } else {
      sundayM = "No"
    }

    // Modify Header Name
    $(e)
      .parent()
      .parent()
      .children()
      .eq(0)
      .children()
      .eq(0)
      .text(`${all.eq(0).val()} ${all.eq(1).val()}`);

    parent.empty();
    parent.append(
      `<b>Name:</b> ${all.eq(0).val()}<br><b>Surname:</b> ${all.eq(1).val()}<br><b>Type:</b> ${valType}<br><b>Sex:</b> ${valGender}<br><b>Transport:</b> ${canBring}<br><b>Partner:</b> ${partner}<p style="margin: 10px 0px 0px 0px;"><b>Free Days</b></p><div style="margin-left: 10px;">Monday: ${mondayM}<br>Tuesday: ${tuesdayM}<br>Wensday: ${wensdayM}<br>Thursday: ${thursdayM}<br>Friday: ${fridayM}<br>Saturday: ${saturdayM}<br>Sunday: ${sundayM}</div>`
    );

    let arr = [
      all.eq(0).val(),
      all.eq(1).val(),
      valType,
      valGender,
      canBring,
      partner,
      e.id,
      [mondayM,tuesdayM,wensdayM,thursdayM,fridayM,saturdayM,sundayM]
    ];
    modifyObj(personInObj, ...arr);
  });
}

//! MODIFY OBJ
function modifyObj(id, ...arg) {
  if (arg[4] === "Yes") {
    arg[4] = true;
  } else {
    arg[4] = false;
  }

  if (arg[5] === "Yes") {
    arg[5] = true;
  } else {
    arg[5] = false;
  }

  $(arg[7]).each((i,val)=>{
    if(val === "Yes") arg[7][i] = true
    else arg[7][i] = false
  })

  obj.persons[id].splice(0, 8, ...arg);
}

//! Deactivating function
function deactivateButton(e) {
  let mainParent = $(e).parent().parent().parent().parent(),
    elem = $(e).parent().parent().parent(),
    id = $(e).attr('id');

    
  // DOM modification
  elem.remove();
  $("#deactCollapse").append(elem);
  let buttonsDiv = $(e).parent(), // buttons div
     buttons = $(e).parent().children(); // buttons modify, delete, deactivate
  
  // Append button activate
  buttonsDiv.empty()
  let newButton = $('<button><span class="glyphicon glyphicon-upload"></span></button>').addClass('activateBtn')
  buttonsDiv.append(newButton)

  // Append buttons modify, delete and deactivate
  // Activate in DOM and obj
  newButton.click(()=>{
    // DOM modification
    buttonsDiv.empty();
    buttonsDiv.append(buttons);
    elem.remove();
    mainParent.append(elem);

    // obj modification
    let index = obj.deactivated.findIndex((val) => val.includes(id));
    obj.persons.push(obj.deactivated[index])
    obj.deactivated.splice(index,1)
    calcolateLength();
  })

  // obj modification
  let index = obj.persons.findIndex((val) => val.includes(id));
  obj.deactivated.push(obj.persons[index])
  obj.persons.splice(index,1)
  calcolateLength();
}

//! Check if name and surname already exist on database and in case Alert
let nameDuplicate, surnameDuplicate, divNameDuplicate, divSurnameDuplicate;
$("#nomePr").change(function () {
  nameDuplicate = $(this).val();

  let testPresence = obj.persons.some((val) => {
    return val[0].toLowerCase() === nameDuplicate.toLowerCase();
  });
  if (testPresence) {
    divNameDuplicate = $(
      `<div class="alertAddedPersons alert alert-info">You already added another ${nameDuplicate}</div>`
    );
    $(this).parent().append(divNameDuplicate);
  } else {
    try {
      divNameDuplicate.remove();
    } catch (error) {}
  }
});
$("#cognomePr").change(function () {
  surnameDuplicate = $(this).val();

  let testPresence = obj.persons.some((val) => {
    return (
      val[1].toLowerCase() === surnameDuplicate.toLowerCase() &&
      val[0].toLowerCase() === nameDuplicate.toLowerCase()
    );
  });

  if (testPresence) {
    divSurnameDuplicate = $(
      `<div class="alertAddedPersons alert alert-danger">You already added another ${nameDuplicate} ${surnameDuplicate}, are you sure you want to continue?</div>`
    );
    $(this).parent().append(divSurnameDuplicate);
  } else {
    try {
      divSurnameDuplicate.remove();
    } catch (error) {}
  }
});

//! Add peoples list length at parent
function calcolateLength() {
  $("#publishersCollapseLength").text(
    $("#publishersCollapse").children().length
  );
  $("#eldersCollapseLength").text($("#eldersCollapse").children().length);
  $("#pioneersCollapseLength").text($("#pioneersCollapse").children().length);
  $("#deactivatedCollapseLength").text($("#deactCollapse").children().length);
}

//! Show ToolTip
let intervalId = setInterval(() => {
  $("button").hover(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });
}, 10000);
setTimeout(() => {
  clearInterval(intervalId);
}, 300000);
