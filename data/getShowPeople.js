//todo ADD: Possibility to disable people
//todo ADD: SearchBar

let count = 0,
  obj = { persons: [] }, //! Obj that will be used to stored all persons
  partenerTranslate,
  canBringTranslate;

//! Reading new Person and add it
function addIt(name, surname, type, gender, partner, canBring, id) {
  let idChecked;
  if (id[0] === "N") idChecked = id;
  else idChecked = `N${id}`;
  let arr = [name, surname, type, gender, canBring, partner, idChecked];

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

  // Setting obj with key/value
  obj.persons.push(arr);

  // Building DOM
  let div1 = $("<div>").addClass("panel panel-default");
  let div2 = $("<div>").addClass("panel-heading procHead");
  let h5 = $("<h5>").addClass("panel-body").addClass("headPersonsAdjusted");
  let a = $(
    '<a data-toggle="collapse" class="procHeadText" data-parent="#accordion"></a>'
  )
    .text(`${name} ${surname}`)
    .attr("href", `#${count}`);

  let deleteBtn = $("<button onclick='deleteButton(this)'>X</button>").attr(
    "id",
    `N${count}`
  );
  let modifyBtn = $("<button onclick='modifyButton(this)'>M</button>").attr(
    "id",
    `N${count}`
  );
  let div3 = $("<div>")
    .addClass("panel-collapse collapse procbody")
    .attr("id", `${count}`);

  let info = $("<div>")
    .addClass("panel-body infoPadding")
    .html(
      `<b>Name:</b> ${name}<br><b>Surname:</b> ${surname}<br><b>Type:</b> ${type}<br><b>Sex:</b> ${gender}<br><b>Transport:</b> ${canBringTranslate}<br><b>Partner:</b> ${partenerTranslate}`
    );

  h5.append(a);
  div2.append(h5);
  div2.append(deleteBtn);
  div2.append(modifyBtn);
  div1.append(div2);
  div3.append(info);
  div1.append(div3);
  $("#accordion").append(div1);
  count++;
}

//! Listen to key pression to execute buttons
$(document).on("keydown", function (e) {
  if (e.originalEvent.code === "Enter") $("#btn-add").click();
  // if (e.originalEvent.code === "KeyA") $("#addPersonBtn").click();
});

//! Get propreties on form button
$("#btn-add").on("click", function (e) {
  // confirm adding, animation
  $(".alert").slideToggle(300).attr("style", "display:block;");
  setTimeout(() => $(".alert").fadeOut(500), 1500);

  // getting propreties
  let name = $("#nomePr").val();
  let surname = $("#cognomePr").val(),
    type = $("input[class='type']:checked").attr("id"),
    gender = $("input[class='gndr']:checked").attr("id"),
    partner = $("#sessoOpposto"),
    canBring = $("#canBring");

  let partnerChecked = partner[0].checked;
  let canBringChecked = canBring[0].checked;

  addIt(name, surname, type, gender, partnerChecked, canBringChecked, count);
});

//! Export File clicking on button
$("#exportFile").on("click", function () {
  var a = document.createElement("a");
  content = JSON.stringify(obj);
  var file = new Blob([content], { type: "data/json" });
  urlFile = URL.createObjectURL(file);
  a.href = urlFile;
  a.download = "metti-questo-file-in-data.json";
  a.click();
});

//! Create a hidden file type input to import a file
let inputFile = $('<input type="file" id="inputElement" accept="json"/>');

//! On click trigger inputFile
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
      parsed.persons.forEach((val) => {
        val.pop();
        val.push(count);
        addIt(...val);
      });
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

  try {
    $(e)
      .parent()
      .parent()
      .fadeOut(300)
      .then((e) => e.remove());
  } catch (e) {}
}

//! Add Modify for DOM and call fn to modify OBJ
function modifyButton(e) {
  let inputModify,
    nameCheck,
    nameCheck1,
    nameCheck2,
    personInObj,
    switching = 0;

  let parent = $(e).parent().next().children();
  let previusText = parent.html();
  parent.empty();

  obj.persons.forEach((val, i) => {
    if (val.includes(e.id)) personInObj = i;
  });

  // GENERATE DOM FOR MODIFING
  obj.persons.forEach((val) => {
    console.log(val);
    console.log(e.id);
    if (val.includes(e.id)) {
      val.forEach((val, i) => {
        if (i === 6) {
        } else if (i === 2) {
          let div = $("<div style='margin:5px 0px'>");
          let form = $("<form></form>");
          nameCheck = $(
            '<label class="radio-inline textInformationModify" style="margin:0px 0px 0px 5px"><input class="type" id="Publisher" type="radio" name="optradio">Publisher</label>'
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
            '<label class="radio-inline textInformationModify" style="margin:0px 0px 0px 5px"><input class="type" id="FemaleModify" type="radio" name="optradio">Female</label>'
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
              `<input type='checkbox' style="position: absolute; z-index: 1000;">`
            );
            nameCheck = $(
              "<p class='textInformationModify checkbox-inline'>"
            ).text("Can transport kolichka");
            switching = 1;
          } else {
            inputModify = $(
              `<input style="position: absolute; z-index: 1000;" type='checkbox'>`
            );
            nameCheck = $(
              "<p class='textInformationModify checkbox-inline'>"
            ).text("Can be partnered with other sex");
          }

          div.append(inputModify).append(nameCheck);
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

  // MODIFY FUNCTION
  saveModify.on("click", function () {
    let all = parent.children(),
      type = all.eq(2).children().children(),
      valType,
      gender = all.eq(3).children(),
      valGender,
      canBring = all.eq(4).children().eq(0).prop("checked"),
      partner = all.eq(5).children().eq(0).prop("checked");

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

    parent.empty();
    parent.append(
      `<b>Name:</b> ${all.eq(0).val()}<br><b>Surname:</b> ${all
        .eq(1)
        .val()}<br><b>Type:</b> ${valType}<br><b>Sex:</b> ${valGender}<br><b>Transport:</b> ${canBring}<br><b>Partner:</b> ${partner}`
    );

    // Modify Header Name
    $(e)
      .parent()
      .children()
      .eq(0)
      .children()
      .eq(0)
      .text(`${all.eq(0).val()} ${all.eq(1).val()}`);

    let arr = [
      all.eq(0).val(),
      all.eq(1).val(),
      valType,
      valGender,
      canBring,
      partner,
      e.id,
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

  obj.persons[id].splice(0, 7, ...arg);
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
    divNameDuplicate.remove();
  }
});

$("#cognomePr").change(function () {
  surnameDuplicate = $(this).val();

  let testPresence = obj.persons.some((val) => {
    return val[1].toLowerCase() === surnameDuplicate.toLowerCase() && val[0].toLowerCase() === nameDuplicate.toLowerCase()
  });

  console.log(testPresence)
  if (testPresence) {
    divSurnameDuplicate = $(
      `<div class="alertAddedPersons alert alert-danger">You already added another ${nameDuplicate} ${surnameDuplicate}, are you sure you want to continue?</div>`
    );
    $(this).parent().append(divSurnameDuplicate);
  } else {
    divSurnameDuplicate.remove();
  }
});
