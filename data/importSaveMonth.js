let previusAllPersons

//! Export allPersons obj clicking on Save Month
$("#saveMonth").on("click", function () {
  if (Object.keys(allPersons).length === 0) {
    $("#noMonthSave").slideDown(300).attr("style", "display:block;");
    setTimeout(() => $("#noMonthSave").fadeOut(2000), 2000);
  } else if (
    confirm(
      "Are you sure you want to save the file? Put the file in a safe folder, as Months."
    )
  ) {
    var a = document.createElement("a");
    content = JSON.stringify(allPersons);
    var file = new Blob([content], { type: "data/json" });
    urlFile = URL.createObjectURL(file);
    a.href = urlFile;
    a.download = `${$(".monthText").text().split(' ').join('-')}.json`;
    a.click();
  }
});

//! Create a hidden file type input to import the allPersons obj & clicking on Import Month trigger it
let inputMonth = $('<input type="file" id="inputElement" accept="json"/>');
$("#importMonth").on("click", function () {
  inputMonth.click();  
});

//! Read data from imported month
inputMonth.on("change", function (evt) {

  var files = evt.target.files; // FileList object

  // use the 1st file from the list
  f = files[0];

  var reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function (theFile) {
    return function (e) {
      previusAllPersons = JSON.parse(e.target.result);

      if(Object.keys(previusAllPersons)[0].length <= 3){
        // create div to show which month was added
        let div = $('<div></div>').addClass('divMonthShow'),
          p = $('<p></p>').addClass('pMonthShow').text(theFile.name.match(/[^\.json]/g).join(''))
          div.append(p)
        $('.divMonthBtns').after(div)
        $(".divMonthShow").fadeIn(200).attr("style", "display:block;");
      } else {
        // show error message
        $("#notMonth").slideDown(300).attr("style", "display:block;");
        setTimeout(() => $("#notMonth").fadeOut(2000), 2000);
      }
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);
});
